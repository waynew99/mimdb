# Final feedback for MIMDB

( ) tagged commit on main for sprint3
(X) set of closed user stories
(X) working deployment on Heroku
( ) tests pass
( ) handoff instructions
(X) presentation
( ) writeup

## Checklist notes

- There is no sprint 3 tag
- The handoff instructions are missing
- You have a considerable number of tests that are failing (about half, with a similar number skipped)

## Discussion

### User stories

The first ten or so things I looked at in the backlog were not user stories. There is one (#60) that is framed as a user story, but should not be (nor should it be in the project backlog -- setting up meetings is not a development issue). Items like #126 are also not really user stories. An acceptance criteria of "no styling looks out of place while browsing" is not testable.



### Agility/scrum

if there is one thing that your team excelled at, it was a steady pattern of commits. Your project accounts for more than half of the total commits on projects across the two sections. I see points on some of the items in the backlog, but it is not obvious to me that you really used the points consistently or thought about your velocity as you were going.


### Integration

There is a good collection of PRs, and many of them have at the very least LGTM comments. You clearly were making good use of feature branches as you went. That said, there are a lot of dangling branches at the moment.

### Implementation

Your group has been remarkably productive and produced a ton of code. I worry about how maintainable it is (to some extent we will find out over j-term). There are still blocks of code comments out in certain components and those worrying remarks along the lines of "commented out because it breaks everything". There is little guidance on what individual components do (a header comment in each file would help a lot). You also didn't use PropTypes, which is enormously useful in establishing the interface for your components. 



Some smaller comments:
- Organizationally, I would make a separate directory for contexts, rather than hiding them in components (since they aren't components). 
- You don't need the full catch all routes (`[[...whatever]]`) if you always expect a slug to be in place. 

### Functionality

For the most part, I think you have done a tremendous job with the site. You put a lot of attention into the look and feel (though the transparent drop down menus aren't wonderful -- they are hard to read when they drop over other things). I wonder, however, if you spent a little less time on the look and feel whether you would have had time to better incorporate the core functionality of getting data into the system. 

All of the administrative/submission portions feel a little under-baked. The admin page in particular is completely bare-bones. It feels like you didn't really take the time to think through the user flow with authentication and what submission would really be like. 


## Final thoughts

Overall, I think you did a great job on the project, and I am happy that it has the potential to actually go into service. If I would adjust anything about how you tackled this, I would have encouraged you to follow the practices I laid out (TDD, writing good user stories) and perhaps shifted your priorities a little bit so that the more complex pieces (submissions, editing, administration) were a little better covered. However, it sounds like at least some of the structures (standup, pair programming, and retrospectives) did help you evolve your development practice and get you working together as a team.