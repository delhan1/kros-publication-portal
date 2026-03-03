import { Comment } from '../../models/comments.model';

export const commentsMockDb: Comment[] = [
  {
    id: 1,
    user_id: 2,
    post_id: 1,
    body: `Great introduction to Angular Signals. I especially liked the explanation 
of how computed values automatically track dependencies. It makes reactive state 
much easier to reason about compared to manual subscriptions.`,
    created_at: new Date().toISOString(),
    name: 'Anna Brown',
    email: 'anna@mail.com',
  },
  {
    id: 2,
    user_id: 1,
    post_id: 1,
    body: `I have been using RxJS for years, but Signals feel much more intuitive 
for component-level state. The synchronous nature simplifies debugging and 
reduces unexpected behavior in templates.`,
    created_at: new Date().toISOString(),
    name: 'John Smith',
    email: 'john@mail.com',
  },
  {
    id: 3,
    user_id: 3,
    post_id: 2,
    body: `Interesting comparison between RxJS and Signals. I agree that both 
have their place in modern Angular applications. For complex async flows, 
RxJS is still extremely powerful.`,
    created_at: new Date().toISOString(),
    name: 'Peter Johnson',
    email: 'peter@mail.com',
  },
  {
    id: 4,
    user_id: 2,
    post_id: 3,
    body: `State management without heavy libraries is definitely appealing. 
Keeping the architecture simple makes onboarding new developers much easier.`,
    created_at: new Date().toISOString(),
    name: 'Anna Brown',
    email: 'anna@mail.com',
  },
  {
    id: 5,
    user_id: 1,
    post_id: 4,
    body: `Lazy loading strategies can significantly improve performance. 
We applied similar techniques in our production app and reduced the initial 
bundle size dramatically.`,
    created_at: new Date().toISOString(),
    name: 'John Smith',
    email: 'john@mail.com',
  },
  {
    id: 6,
    user_id: 3,
    post_id: 5,
    body: `Designing a clean service layer pays off in the long run. 
It makes testing easier and avoids tight coupling between UI components 
and backend APIs.`,
    created_at: new Date().toISOString(),
    name: 'Peter Johnson',
    email: 'peter@mail.com',
  },
  {
    id: 7,
    user_id: 2,
    post_id: 6,
    body: `Reactive Forms are incredibly flexible. Custom validators 
and dynamic controls allow you to build complex user flows without 
making the codebase messy.`,
    created_at: new Date().toISOString(),
    name: 'Anna Brown',
    email: 'anna@mail.com',
  },
  {
    id: 8,
    user_id: 1,
    post_id: 7,
    body: `Improving developer experience should always be a priority. 
Clear structure and consistent naming conventions reduce long-term 
maintenance costs.`,
    created_at: new Date().toISOString(),
    name: 'John Smith',
    email: 'john@mail.com',
  },
  {
    id: 9,
    user_id: 3,
    post_id: 8,
    body: `Testing strategies are often underestimated. A good mix of 
unit and integration tests helps prevent regressions and increases 
confidence during refactoring.`,
    created_at: new Date().toISOString(),
    name: 'Peter Johnson',
    email: 'peter@mail.com',
  },
  {
    id: 10,
    user_id: 2,
    post_id: 2,
    body: `Error handling is just as important as feature development. 
Providing clear feedback to users improves trust and overall experience.`,
    created_at: new Date().toISOString(),
    name: 'Anna Brown',
    email: 'anna@mail.com',
  },
];
