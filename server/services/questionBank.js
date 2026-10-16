// Plan B: jab AI busy ho tab interview isi practice set se chalta hai.
// Har question ke saath ek chhota "ideal answer" hai, jo result page par dikhta hai
// aur basic scoring mein keywords milane ke kaam aata hai.

const BANK = {
  react: [
    ["What is the virtual DOM and why does React use it?", "The virtual DOM is a lightweight copy of the real DOM kept in memory. When state changes, React compares the new virtual DOM with the old one (diffing) and updates only the changed parts of the real DOM, which is faster than re-rendering everything."],
    ["What is the difference between state and props?", "Props are read-only data passed from a parent component to a child. State is data owned and managed inside a component that can change over time; changing state re-renders the component."],
    ["Why do we pass a key prop when rendering a list?", "Keys give each list item a stable identity so React can track which items were added, removed or moved and update only those. Using the array index as a key can cause bugs when the list order changes."],
    ["What does the useEffect hook do?", "useEffect runs side effects after render, such as fetching data, setting timers or subscriptions. The dependency array controls when it runs again, and the returned cleanup function runs before the next effect or on unmount."],
    ["What is the difference between a controlled and an uncontrolled component?", "In a controlled component the form value is stored in React state and updated through onChange. In an uncontrolled component the DOM keeps the value and React reads it with a ref when needed."],
    ["What is prop drilling and how can you avoid it?", "Prop drilling is passing props through many layers of components that do not need them. It can be avoided with the Context API or a state management library such as Redux or Zustand."],
    ["What is the Context API used for?", "Context shares data like the logged-in user or theme with many components without passing props manually at every level. A Provider supplies the value and components read it with useContext."],
    ["How does React Router let you have multiple pages in a single page app?", "React Router matches the browser URL to a route and renders the matching component without reloading the page. It uses components like BrowserRouter, Routes, Route and Link, and hooks like useNavigate and useParams."],
    ["What are useMemo and useCallback used for?", "Both are performance hooks. useMemo caches the result of an expensive calculation and useCallback caches a function, so they are recreated only when their dependencies change."],
    ["How would you fetch data from an API in a React component?", "Call the API inside useEffect using fetch or axios, store the result in state, and show loading and error states. Add the right dependencies so it does not run in an infinite loop."],
  ],
  node: [
    ["What is Node.js and why is it single-threaded?", "Node.js is a JavaScript runtime built on the V8 engine for running JavaScript on the server. It uses a single main thread with an event loop and non-blocking I/O, so it can handle many requests without creating a thread for each one."],
    ["What is the event loop in Node.js?", "The event loop keeps checking for finished asynchronous tasks such as file reads, timers or network calls and runs their callbacks. This lets Node handle many operations at once without blocking the main thread."],
    ["What is middleware in Express?", "Middleware is a function that runs between the request and the response. It receives req, res and next, can change the request or end the response, and calls next() to pass control to the next middleware, for example for logging or checking login."],
    ["What is the difference between require and import?", "require is the CommonJS way of loading modules and works synchronously. import is the ES Modules syntax, which is static and supports features like tree shaking; Node uses it when type is module in package.json."],
    ["How do you handle errors in async/await code in Express?", "Wrap the await calls in try/catch and send a proper status code and message. A central error-handling middleware with four arguments (err, req, res, next) keeps error responses consistent."],
    ["What are environment variables and why do we use a .env file?", "Environment variables store configuration like database URLs and API keys outside the code. A .env file loaded with dotenv keeps secrets out of the source code and lets each environment use different values."],
    ["What is the difference between PUT and PATCH?", "PUT replaces the whole resource with the data sent, while PATCH updates only the fields that are sent."],
    ["What is CORS and why do we need it?", "CORS is a browser security rule that blocks requests from a different origin unless the server allows them. In Express the cors middleware sets the headers that tell the browser which origins may call the API."],
    ["What is JWT and how is it used for authentication?", "A JSON Web Token is a signed token that stores user information such as the user id. After login the server sends it to the client, the client sends it in the Authorization header, and the server verifies the signature on each request."],
    ["What are streams in Node.js?", "Streams process data piece by piece instead of loading it all into memory. They are useful for large files or network data; the main types are readable, writable, duplex and transform streams."],
  ],
  mongo: [
    ["What is the difference between SQL and MongoDB?", "SQL databases store data in tables with a fixed schema and use joins. MongoDB is a NoSQL document database that stores flexible JSON-like documents in collections, which makes it easy to change the structure."],
    ["What is Mongoose and why do we use it?", "Mongoose is an ODM library for MongoDB in Node.js. It lets you define schemas and models, adds validation, and gives easy methods like find, create and populate."],
    ["What is an index in MongoDB?", "An index is a special data structure that stores selected fields in sorted order so queries on those fields are much faster. Without an index MongoDB has to scan every document in the collection."],
    ["What does populate do in Mongoose?", "populate replaces a stored ObjectId reference with the actual document from the other collection, similar to a join in SQL."],
  ],
  java: [
    ["What are the four pillars of OOP?", "Encapsulation hides data inside a class, inheritance lets a class reuse another class, polymorphism lets one method behave differently for different objects, and abstraction shows only the essential details."],
    ["What is the difference between an abstract class and an interface?", "An abstract class can have both abstract and normal methods, constructors and state, and a class can extend only one. An interface defines a contract; a class can implement many interfaces."],
    ["What is the difference between == and equals() in Java?", "== compares references, meaning whether both variables point to the same object. equals() compares the actual content and can be overridden, as String does."],
    ["What is the difference between ArrayList and LinkedList?", "ArrayList uses a dynamic array, so reading by index is fast but inserting in the middle is slow. LinkedList uses nodes, so insertion and deletion are fast but reading by index is slow."],
    ["What is exception handling in Java?", "Exception handling uses try, catch and finally to handle runtime errors without crashing the program. Checked exceptions must be handled or declared with throws; unchecked ones extend RuntimeException."],
    ["What is the difference between method overloading and overriding?", "Overloading means same method name with different parameters in the same class, decided at compile time. Overriding means a subclass gives its own version of a parent method, decided at runtime."],
    ["Why is String immutable in Java?", "Once created, a String object cannot change. This allows the string pool to share objects safely, makes strings thread-safe, and keeps values used as keys or in security checks reliable."],
    ["What is the JVM, JRE and JDK?", "The JVM runs Java bytecode. The JRE is the JVM plus libraries needed to run programs. The JDK is the JRE plus development tools like the compiler javac."],
    ["What is a HashMap and how does it work?", "A HashMap stores key-value pairs. It uses the key's hashCode to find a bucket, and if two keys land in the same bucket it handles the collision with a list or tree and uses equals to find the right key."],
    ["What is multithreading in Java?", "Multithreading runs multiple threads at the same time inside one program. Threads are created by extending Thread or implementing Runnable, and synchronized blocks prevent problems when threads share data."],
  ],
  python: [
    ["What is the difference between a list and a tuple?", "A list is mutable, so items can be added or changed, and uses square brackets. A tuple is immutable, uses round brackets and is slightly faster."],
    ["What is a dictionary in Python?", "A dictionary stores key-value pairs with fast lookup by key. Keys must be unique and immutable, for example strings or numbers."],
    ["What are *args and **kwargs?", "*args collects extra positional arguments into a tuple and **kwargs collects extra keyword arguments into a dictionary, so a function can accept a variable number of arguments."],
    ["What is a list comprehension?", "A list comprehension builds a new list in one line from an existing iterable, for example [x * x for x in nums if x > 0]. It is shorter and usually faster than a normal loop."],
    ["What is the difference between deep copy and shallow copy?", "A shallow copy creates a new outer object but still shares the inner objects. A deep copy copies everything recursively, so changes to nested objects do not affect the original."],
    ["What are decorators in Python?", "A decorator is a function that takes another function and adds behaviour to it without changing its code, written with the @ symbol, for example for logging or checking login."],
    ["How do you handle exceptions in Python?", "Use try and except to catch errors, else for code that runs if there was no error, and finally for clean-up that always runs. You can raise your own exceptions with raise."],
    ["What is the difference between is and ==?", "== checks whether two values are equal. is checks whether both variables point to the same object in memory."],
    ["What is a virtual environment?", "A virtual environment is an isolated Python setup for one project with its own installed packages, so different projects can use different versions without conflicts."],
    ["What are generators in Python?", "A generator is a function that uses yield to return values one at a time instead of building a whole list. It saves memory for large or infinite sequences."],
  ],
  data: [
    ["What is the difference between mean, median and mode?", "Mean is the average, median is the middle value when data is sorted, and mode is the most frequent value. The median is better than the mean when data has outliers."],
    ["How do you handle missing values in a dataset?", "First check how many values are missing and why. Then remove rows or columns if very few are missing, or fill them with the mean, median, mode or a forward fill, depending on the data."],
    ["What is the difference between INNER JOIN and LEFT JOIN?", "INNER JOIN returns only rows that match in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right, with NULL where there is no match."],
    ["What is an outlier and how do you detect it?", "An outlier is a value far away from the rest of the data. It can be found with a box plot, the IQR rule (below Q1 - 1.5*IQR or above Q3 + 1.5*IQR) or z-scores."],
    ["What is the difference between correlation and causation?", "Correlation means two variables move together. Causation means one actually causes the other. Correlation alone does not prove causation, because a third factor may affect both."],
    ["What does GROUP BY do in SQL?", "GROUP BY groups rows with the same values in a column so aggregate functions like COUNT, SUM or AVG can be applied to each group. HAVING filters the groups."],
    ["Which chart would you use to show a trend over time?", "A line chart, because it clearly shows how a value goes up or down across dates. For comparing categories a bar chart is better."],
    ["What is data cleaning?", "Data cleaning means fixing or removing wrong, duplicate, missing or badly formatted data so that the analysis is accurate."],
    ["What is a pivot table?", "A pivot table summarises data by grouping rows and calculating totals, averages or counts, which makes it easy to compare categories quickly."],
    ["What is the difference between a KPI and a metric?", "A metric is any measurable number. A KPI is a metric chosen because it directly shows progress towards an important business goal."],
  ],
  dsa: [
    ["What is the difference between an array and a linked list?", "An array stores items in continuous memory, so access by index is O(1) but inserting in the middle is O(n). A linked list stores nodes with pointers, so insertion is easy but access by index is O(n)."],
    ["What is time complexity and what does O(n) mean?", "Time complexity describes how the running time grows as the input size grows. O(n) means the time grows linearly with the input size."],
    ["What is the difference between a stack and a queue?", "A stack is LIFO: the last item added is removed first, using push and pop. A queue is FIFO: the first item added is removed first, using enqueue and dequeue."],
    ["How does binary search work and what is its complexity?", "Binary search works on a sorted array. It checks the middle element and discards half of the array each time, so it runs in O(log n)."],
    ["Why does a hash map give O(1) average lookup time?", "A hash function turns the key into an index, so the value can be found directly without searching. When two keys get the same index it is a collision, handled with chaining or open addressing; many collisions make it slower."],
    ["What is recursion?", "Recursion is when a function calls itself to solve a smaller part of the problem. It needs a base case to stop; otherwise it causes a stack overflow."],
    ["What is the two pointers technique?", "Two pointers uses two indexes that move through the data, often from both ends of a sorted array, to solve problems like pair sum or removing duplicates in O(n) instead of O(n²)."],
    ["What is the difference between BFS and DFS?", "BFS explores level by level using a queue and finds the shortest path in an unweighted graph. DFS goes as deep as possible first using a stack or recursion."],
    ["Which sorting algorithm would you use and why?", "Merge sort guarantees O(n log n) and is stable; quick sort is O(n log n) on average and fast in practice but O(n²) in the worst case. Built-in sorts are usually the best choice."],
    ["What is a binary search tree?", "A binary search tree is a tree where every left child is smaller and every right child is larger than its parent, so search, insert and delete take O(log n) when the tree is balanced."],
  ],
  hr: [
    ["Tell me about yourself.", "Give a short 1-minute summary: your education, key skills, one or two projects you are proud of, and why you are interested in this role."],
    ["Why do you want to join our company?", "Show that you researched the company: mention its product or work, how it matches your skills and interests, and what you want to learn there."],
    ["What are your strengths and weaknesses?", "Pick a real strength with an example. For a weakness, choose something genuine but not critical and explain what you are doing to improve it."],
    ["Tell me about a challenge you faced in a project and how you solved it.", "Use the STAR method: Situation, Task, Action you took, and the Result. Focus on what you did and what you learned."],
    ["Where do you see yourself in five years?", "Talk about growing your skills, taking more responsibility and contributing to bigger projects, ideally in a way that fits the company."],
    ["How do you handle pressure or tight deadlines?", "Explain how you plan and prioritise tasks, break work into smaller parts and communicate early, with a short real example."],
    ["Describe a time you worked in a team.", "Share a real example, your role in the team, how you handled disagreements, and what the team achieved."],
    ["Why should we hire you?", "Connect your skills and projects to what the role needs, and show your eagerness to learn and contribute quickly."],
    ["How do you keep learning new technologies?", "Mention concrete habits such as courses, documentation, building small projects and practising regularly, with an example of something you learned recently."],
    ["Do you have any questions for us?", "Always ask one or two thoughtful questions, for example about the team, the tech stack, or what success looks like in the first few months."],
  ],
  general: [
    ["Explain one project you built and the main problem it solves.", "Describe what the project does, who it is for, the tech stack, your own part in it and one challenge you solved."],
    ["What is the difference between authentication and authorization?", "Authentication checks who the user is, for example by login. Authorization checks what that user is allowed to do."],
    ["What is REST and what are the common HTTP methods?", "REST is a style for designing APIs around resources and URLs. GET reads, POST creates, PUT or PATCH updates, and DELETE removes data."],
    ["How do you store a password safely in a database?", "Never store plain text. Hash the password with a slow hashing algorithm like bcrypt, which adds a salt, and compare hashes at login."],
    ["How would you make a slow web page load faster?", "Measure first, then compress and resize images, reduce JavaScript bundle size with code splitting, use caching and a CDN, and lazy-load content."],
    ["What is Git and why is version control important?", "Git tracks every change in the code, lets you go back to older versions, and lets many people work together using branches and merges."],
    ["What happens when you type a URL into the browser?", "The browser finds the IP with DNS, connects to the server, sends an HTTP request, receives HTML, CSS and JavaScript, and then renders the page."],
    ["What is the difference between let, const and var?", "var is function-scoped and hoisted. let and const are block-scoped; const cannot be reassigned, while let can."],
    ["What is an API?", "An API is a set of rules that lets one program talk to another, for example a frontend asking a backend for data over HTTP."],
    ["How do you debug a problem you have never seen before?", "Reproduce it, read the error message, isolate the smallest failing part, use logs or a debugger, search documentation, and fix the cause rather than the symptom."],
  ],
};

// Role ke naam se sahi set chuno
function setsForRole(role) {
  const r = role.toLowerCase();
  if (/\bhr\b|human resource/.test(r)) return ["hr"];
  if (r.includes("dsa") || r.includes("algorithm")) return ["dsa"];
  if (r.includes("mern") || r.includes("full stack") || r.includes("fullstack")) return ["react", "node", "mongo"];
  if (r.includes("react") || r.includes("frontend") || r.includes("javascript")) return ["react"];
  if (r.includes("node") || r.includes("express") || r.includes("backend")) return ["node", "mongo"];
  if (r.includes("mongo")) return ["mongo"];
  if (r.includes("java")) return ["java"];
  if (r.includes("python")) return ["python"];
  if (r.includes("data")) return ["data"];
  return ["general"];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// count questions do (role ke set se, kam padein to general se)
export function pickBankQuestions(role, count) {
  const main = shuffle(setsForRole(role).flatMap((key) => BANK[key]));
  const extra = shuffle(BANK.general).filter(([q]) => !main.some(([m]) => m === q));
  return [...main, ...extra].slice(0, count).map(([q]) => q);
}

// Kisi question ka ideal answer (agar bank mein hai)
export function bankAnswerFor(question) {
  for (const list of Object.values(BANK)) {
    const found = list.find(([q]) => q === question);
    if (found) return found[1];
  }
  return null;
}
