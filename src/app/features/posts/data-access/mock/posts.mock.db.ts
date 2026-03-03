import { Post } from '../../models/posts.model';

export const postsMockDb: Post[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Understanding Angular Signals',
    body: `Angular Signals introduce a new reactive primitive that allows developers 
to model state in a more predictable and fine-grained way. Unlike traditional 
RxJS streams, signals are synchronous and track dependencies automatically. 
This makes them easier to reason about in component templates and services. 
In larger applications, they can significantly reduce boilerplate code.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 2,
    title: 'RxJS vs Signals: A Practical Comparison',
    body: `Both RxJS and Angular Signals solve reactive problems, but they target 
different use cases. RxJS excels at complex asynchronous workflows and event streams, 
while Signals shine in state management scenarios. In real-world projects, 
the best approach is often combining both instead of choosing one exclusively.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 3,
    title: 'State Management Without NgRx',
    body: `Managing state without a heavy external library is now much easier 
thanks to Signals. By leveraging computed values and effects, you can build 
a clean and maintainable architecture. This approach works especially well 
for medium-sized applications where simplicity and readability are priorities.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    user_id: 1,
    title: 'Lazy Loading and Performance Tips',
    body: `Performance optimization in Angular applications starts with proper 
lazy loading strategies. Splitting features into standalone components and 
deferring non-critical content can drastically reduce initial bundle size. 
Combined with efficient change detection strategies, this results in a smoother user experience.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    user_id: 2,
    title: 'Designing Clean Service Layers',
    body: `A well-designed service layer separates API communication from UI logic. 
By centralizing data access and business rules, you create reusable and testable 
code. This also makes it easier to refactor or migrate to different backend services 
without touching presentation components.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    user_id: 3,
    title: 'Building Reactive Forms the Right Way',
    body: `Reactive Forms provide powerful validation and dynamic form control 
capabilities. When combined with custom validators and well-structured form models, 
they enable highly interactive and maintainable forms. Keeping validation logic 
separate from presentation improves readability and long-term maintainability.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    user_id: 4,
    title: 'Improving Developer Experience in Angular',
    body: `Developer experience plays a crucial role in productivity. 
Clear folder structures, consistent naming conventions, and proper state handling 
reduce cognitive load. Introducing modern features like standalone components 
and Signals can modernize legacy codebases without rewriting everything.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    user_id: 5,
    title: 'Testing Angular Applications Effectively',
    body: `Effective testing requires a balance between unit, integration, 
and end-to-end tests. Mocking services, isolating components, and focusing on 
critical user flows ensure stability. Automated testing pipelines help prevent 
regressions and increase confidence during refactoring.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    user_id: 2,
    title: 'Component Architecture Best Practices',
    body: `A scalable component architecture emphasizes separation of concerns 
and reusability. Presentational components should remain stateless whenever possible, 
while container components manage business logic and data retrieval. This pattern 
simplifies maintenance and encourages better collaboration within teams.`,
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    user_id: 1,
    title: 'Handling Errors Gracefully in Web Apps',
    body: `Graceful error handling improves both user experience and debuggability. 
Displaying meaningful messages, logging errors centrally, and implementing fallback 
strategies prevent frustration. In reactive systems, properly catching and recovering 
from errors ensures that streams remain stable and predictable.`,
    created_at: new Date().toISOString(),
  },
];