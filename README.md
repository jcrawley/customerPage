# customerPage

## Libraries and Technologies used

- The only third party library I used was JQuery to handle cross-browser compatibility functions
- I decided not to use a CSS pre-processor because the number of styles that I had tow rite for the page did not seem worth the overhead. However, a pre processor would have been useful for generating the icons and other html elements with one-offs.

## Shortcomings and areas for future improvement

- The validation on a lot of the fields is generally weak and easy to bypass.
- This page is definitely designed for a desktop browser experience. With more time I would probably have implemented flexbox.
- General inconsistencies in naming convention, spacing, and confusing variable names which can be cleaned up. Also, the general readability and organization of the code can be improved.
- I hardcoded the company id into the JS file. It would be smarter to put the id in the URL and decode it as a request parameter.
- Also, I couldn't find how to get the company address or email from the api responses.

## Technologies I would have used with no restrictions....

- A Javascript framework like Angular or React would have saved me a bunch of time. Dynamic templating would have made filling the elements with api call data much easier and more readable. If I had to choose a framework to use for this I would choose AngularJS. The two way data-binding MVC model would be useful for a peach with so many API calls.

## Things to keep in mind

- I wrote this knowing the api would always fail, therefore I only wrote the fail functions to fill in a response and mimic a success. Ideally if using a working api, my fail functions would del more with state and error handling.
