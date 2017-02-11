# ember-declarative

Tools for declarative component creation.

## Installation

*  `ember install ember-declarative`

## Basic usage

A declarative component renders a (possibly) complex layout, while letting
component users define blocks of content to include in the layout.

Ember already supports a very simple form of declarative component -- a
component used in block form can include a `{{yield}}` which allows the
user to define content to be wrapped in the layout.

`ember-declarative` generalize on this pattern.  At the top of their templates
a complex layout component specifies a "declaration section", which looks like:

    {{#decl/ed-block}}{{yield}}{{/decl/ed-block}}

`declarations` contains contextual components (created using mixins from
`ember-declarative`) with which the user can wrap content. The rest of the
layout component's template is the implementation of the layout, which
can contain special helpers or components derived from `ember-declarative`
marking places where the user content should be placed.

For added customization, and to avoid exposing subcomponents defined
in addons to the global namespace, the declaration block can pass declaration
components in a hash to the user:

    {{#decl/ed-block}}
      {{yield (hash
        foo=(component "foo-declaration" fooParameter=barParameter))}}
    {{/decl/ed-block}}

### Example: Merging Lists

For example, suppose you wanted a component that would merge
different sorted lists, displaying them in alphabetical order, but rendering
each according to a style specified by the user of the component.

The simplest interface would be something like this:

    {{merge-lists lists=lists format=format}}

Here, `lists` is a list of list, and format takes a list item and # of
list that it comes from, and produces html wrapped in `Ember.string`.

There are several drawbacks to this approach, however. If the formatted list
items should include other ember components, things become complex  quickly.
Dynamically generated html is harder to maintain than html embedded in
templates.

Ember-declarative provides tools to rewrite this, so that the user can declare
how they want to display list items using template blocks. The following
description explains the code in the working demo in the dummy app. 

Suppose, for instance, you have two lists of females and males, and wanted to
merge them in alphabetical order, while styling members separately. Ember-
declarative will let you write a simple component which you can use in the
following fashion:

    {{#merge-lists as |decl|}}
      {{#decl.list data=females as |item|}}
        <li style="color:green">{{item}}</li>
      {{/decl.list}}
      {{#decl.list data=males as |item|}}
        <li style="color:red">{{item}}</li>
      {{/decl.list}}
    {{/merge-lists}}

Each `merge-list` block contains arbitrary template code which will be used
to style the individual elements. The top level elements (here, `merge-list`)
are "declarations" -- using a mixin derived from 
`ember-declaration\decl\ed-base\mixin`. 

If we did have a list of lists we wanted to merge, we could also write:

    {{#merge-lists as |decl|}}
      {{#each lists as |list}}
        {{#decl.list data=list}}
        ...
        {{/decl.list}}
      {{/each}}
    {{#merge-lists}}

The blocks of the declaration contain template code to render individual 
list items. `ember-declarative` collects the declarations, and allows 
`merge-lists` to provide targets ("portals") in their alpha sorted order.
This is enough for `ember-declarative` to "teleport" the content into the 
right place, rendering a sorted list, and updating it as the data changes.

To do this, `merge-lists` mixes in `EDContainerMixin`:

    import EDContainerMixin from 'ember-declarative/ed-container/mixin';

    export default Ember.Component.extend(EDContainerMixin, {
    ...
    });

`EDContainerMixin` collects declarations, which are responsible for rendering
fragments and making them available for rendering in place.

The body of `MergeLists` computes the merged list:

    merged: Ember.computed('declarations.@each.dataChanged', function() {
      const declarations = this.get('declarations');
      const merged = Ember.A();
      declarations.forEach((mlist, ilist)=>{
        const data = mlist.get('data');
        if(data != null) {
          merged.addObjects(data.map(
            (item, index)=>({ilist, index, item})))
        }
      });
      const smerged = merged.sortBy('item');
      return smerged;
    })

The `merge-lists` template:

    {{#decl/ed-block as |declarations|}}{{yield declarations}}{{/decl/ed-block}}

    <ul>
      {{#each merged as |item|}}
        {{impl/ed-render declarations item.ilist item.index}}
      {{/each}}
    </ul>

contains a snippet wrapped in `decl/ed-block` that collects the
declarations (which is rendered with `display: none`), then a list
in which the declarations are rendered. `impl/ed-render` puts the
declarations into place.

Here, `item.ilist` is the source list, and `item.index` is the target 
position.

To do this it must coordinate with the `merge-list` declarations:

    import EDPortalMixin from 'ember-declarative/decl/ed-portal/mixin';

    export default Ember.Component.extend(EDPortalMixin, {
      data: null,
      portalElementClass: 'merge-item',
      dataDidChange: Ember.observer('data.[]', function(){
        this.get('data').sort();
        this.notifyPropertyChange("dataChanged");
        this.rerender();
      })
    });

which has template:

    {{#each data as |item|}}
      <div class="merge-item">{{yield item}}</div>
    {{/each}}

`EDPortalMixin` registers itself with declarations, and contains machinery
used by `ed-render` to get the DOM snippets associated with the rendered content.

## Reference

*TODO* -- for the moment, see the documentation in the individual classes.




## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
