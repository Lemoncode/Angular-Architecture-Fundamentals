# GameCatalog

## Notifying from template to component

In this demo we are going to work with notifications from the template to the component by user changes.

* There are three techniques to achieve this:
  - Two-way binding (long way)
  - Getter and setter
  - Value changes observable

* Right now we have this:

```html
<input type="text" [(ngModel)]="listFilter" />
```
* Our component property is changed, but our component is not notified of that change, so we don't have a way to perform an operation input component every time a value changes.

* However we can bind a function in our component. The sad path is that we do not automatically set the property, no two way binding any more

> Visist `http://localhost:4200/games` to check current behavior

* Let's test this in the code

### Step 1. Two Way Binding

Lets use the two way binding long way in our code

__src/app/games/game-list/game-list.component.html__

* Update `game-list.component.html`

```diff 
<div class='row'>
    <div class='col-md-2'>Filter by:</div>
    <div class='col-md-4'>
-       <input type='text'
-               [(ngModel)]='listFilter' />
+       <input type="text"
+                    [ngModel]="listFilter"
+                    (ngModelChange)="onFilterChange($event)">
    </div>
</div>
```

```diff game-list.component.ts
....
toggleImage(): void {
  this.showImage = !this.showImage;
}
+
+onFilterChange(filter: string): void {
+  this.listFilter = filter;
+  this.performFilter(this.listFilter);
+}
...
```
* Lets see if works.

### Step 2. Long Way Two Binding 

Defining a property. Lets move the two way binding long way to getter / setter.

* In TypeScript we can define a property two ways

```typescript 
// Property Declaration
listFilter: string;
```

```typescript Getter and Setter
get listFilter(): string {

}

set listFilter(value: string) {

}
```

```typescript 
// common pattern
private _listFilter: string;

get listFilter(): string {
  return this._listFilter;
}

set listFilter(value: string) {
  this._listFilter = value;
}
```
* Any time we change our value on setter we will get notified!

* Update `game-list.component.html`

```diff 
+<input type='text' [(ngModel)]='listFilter' />
-<input type="text" [ngModel]="listFilter" (ngModelChange)="onFilterChange($event)">
```

* Update `game-list.component.ts`

```diff 
...
-onFilterChange(filter: string): void {
-  this.listFilter = filter;
-  this.performFilter(this.listFilter);
-}
...
```

```diff game-list.component.ts
- listFilter: string;
+private _listFilter: string;
+
+get listFilter(): string {
+  return this._listFilter;
+}
+
+set listFilter(value: string) {
+  this._listFilter = value;
+}
```

### Step 3. Update Filter 

Now the only thing that we have to make this work is call the filter value.

```typescript
set listFilter(value: string) {
  this._listFilter = value;
  this.performFilter(value);
}
```

* When possible use binding and structural directives
* If we need to notify the component when the user changes the value of an input element, we can expand the two-way binding long way.
* Alternativally we can use the get/set, we do not lose two way binding, and template is not modified, more code.
