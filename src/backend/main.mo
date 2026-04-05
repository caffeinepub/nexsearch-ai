import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";

actor {
  type Source = {
    title : Text;
    url : Text;
    favicon : Text;
    snippet : Text;
  };

  type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  type SearchResult = {
    answer : Text;
    sources : [Source];
    followUps : [Text];
    model : Text;
  };

  type Thread = {
    id : Text;
    title : Text;
    messages : [Message];
    results : [SearchResult];
    createdAt : Int;
    updatedAt : Int;
  };

  module Thread {
    public func compare(thread1 : Thread, thread2 : Thread) : Order.Order {
      Text.compare(thread1.id, thread2.id);
    };

    public func compareByUpdateTime(thread1 : Thread, thread2 : Thread) : Order.Order {
      if (thread1.updatedAt < thread2.updatedAt) { #less } else if (thread1.updatedAt > thread2.updatedAt) { #greater } else {
        #equal;
      };
    };
  };

  // Stable variable for threads
  let threads = Map.empty<Principal, Map.Map<Text, Thread>>();

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Create a new thread
  public shared ({ caller }) func createThread(title : Text) : async Text {
    let threadId = title.concat(Time.now().toText());
    let newThread : Thread = {
      id = threadId;
      title;
      messages = [];
      results = [];
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let userThreads = switch (threads.get(caller)) {
      case (?userThreads) { userThreads };
      case (null) { Map.empty<Text, Thread>() };
    };
    userThreads.add(threadId, newThread);
    threads.add(caller, userThreads);

    threadId;
  };

  // Get thread by id
  public query ({ caller }) func getThread(threadId : Text) : async Thread {
    switch (threads.get(caller)) {
      case (?userThreads) {
        switch (userThreads.get(threadId)) {
          case (?thread) { thread };
          case (null) { Runtime.trap("Thread not found") };
        };
      };
      case (null) { Runtime.trap("Thread not found") };
    };
  };

  // List all threads for caller with pagination
  public query ({ caller }) func listThreads(page : Nat, pageSize : Nat) : async [Thread] {
    switch (threads.get(caller)) {
      case (?userThreads) {
        let allThreads = userThreads.values().toArray().sort(Thread.compareByUpdateTime);
        let start = page * pageSize;
        let end = if (start + pageSize > allThreads.size()) { allThreads.size() } else { start + pageSize };
        if (start >= allThreads.size()) { return [] };
        allThreads.sliceToArray(start, end);
      };
      case (null) { [] };
    };
  };

  // Delete thread
  public shared ({ caller }) func deleteThread(threadId : Text) : async Bool {
    switch (threads.get(caller)) {
      case (?userThreads) {
        if (userThreads.containsKey(threadId)) {
          userThreads.remove(threadId);
          threads.add(caller, userThreads);
          true;
        } else {
          false;
        };
      };
      case (null) { false };
    };
  };

  // Get all threads for caller
  public query ({ caller }) func getMyThreads() : async [Thread] {
    switch (threads.get(caller)) {
      case (?userThreads) { userThreads.values().toArray().sort(Thread.compareByUpdateTime) };
      case (null) { [] };
    };
  };

  // Perform search
  public shared ({ caller }) func search(threadId : Text, wildcardQuery : Text, model : Text, focusMode : Text) : async SearchResult {
    // Fetch from external LLM or search API
    // This call should return JSON response which can be parsed on frontend
    let url = "https://api.nexsearch.ai/search?threadId=" # threadId # "&query=" # wildcardQuery # "&model=" # model # "&focusMode=" # focusMode;
    let response = await OutCall.httpGetRequest(url, [], transform);

    // Store message in thread history
    let thread = switch (threads.get(caller)) {
      case (?userThreads) {
        switch (userThreads.get(threadId)) {
          case (?thread) { thread };
          case (null) { Runtime.trap("Thread not found") };
        };
      };
      case (null) { Runtime.trap("Thread not found") };
    };

    let newMessage : Message = {
      role = "user";
      content = wildcardQuery;
      timestamp = Time.now();
    };

    let updatedThread : Thread = {
      id = thread.id;
      title = thread.title;
      messages = thread.messages.concat([newMessage]);
      results = thread.results;
      createdAt = thread.createdAt;
      updatedAt = Time.now();
    };

    let userThreads = switch (threads.get(caller)) {
      case (?userThreads) { userThreads };
      case (null) { Map.empty<Text, Thread>() };
    };
    userThreads.add(threadId, updatedThread);
    threads.add(caller, userThreads);

    // Return raw response for frontend parsing
    {
      answer = response;
      sources = [];
      followUps = [];
      model;
    };
  };
};
