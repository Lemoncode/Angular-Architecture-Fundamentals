## On Push detection

* Following the presentational container component pattern allows us to more easily take advantage of an Angular change detection strategy called OnPush to optimize our view performance. 

* Reading the Angular API documentation for ChangeDetectionStrategy OnPush, it says that change detector's mode will be initial set to CheckOnce. So what does this mean for our performance?, as this is a little bit vague. Basically this strategy tells Angular that a component depends solely on @Inputs and only needs to be checked if it receives a new input reference or if the component or its children trigger a DOM event, like a button click. 

* When I say input reference, I mean that in order to trigger change detection in our component, we need to change the input object reference, not just mutate it. This is another example of how dealing with immutable store data with NgRx can help us take advantage of more advanced patterns. 

* It's important to note any asynchronous API events, like XHR or promise-based events, will not trigger change detection once you change to this strategy of OnPush and the components template will not get updated. By default, Angular uses the ChangeDetectionStrategy.Default change detection strategy. 

* The default strategy doesn't assume anything about the application, therefore every time changes in your application as a result of any user events, timers, XHR requests, promises, etc, change detection will run on all components. This means anything from a click event to a data received from an HTTP call, causes change detection to be triggered, potentially causing performance issues in your application as it checks every component. 

* If we look at this example component tree, the way Angular's change detection system works is that if a button click, for example, occurs down here at the bottom of the tree, it will trigger a round of change detection. Angular's change detection starts at the top at its root component and goes down the component tree, checking every component, even if it has not changed. In contrast, if a button click occurs again, but this time we change this component's change detection strategy to OnPush, Angular will still run around a change detection starting at the root component and working its way down the component tree, however, the component marked with OnPush and all of its children will be skipped. This can make a real world difference in an application with a lot of components loaded with thousands of potential expressions to be checked every time a button is clicked. 

* Using this strategy with the presentational container pattern is pretty simple. On all your container components, you change their ChangeDetectionStrategy to OnPush. This is done in the component's app component decorator. By default the ChangeDetectionStrategy is set to default, but nobody every needs to specify the default. 

* Modify `video-console-board.component.ts`

```diff
@Component({
    templateUrl: './video-console-board.component.html',
+   changeDetection: ChangeDetectionStrategy.OnPush
})
```
