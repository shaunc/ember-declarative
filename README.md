# Ember-declarative

Utilities for the creation of declarative components.

[![Build Status](https://travis-ci.org/shaunc/ember-declarative.svg)](https://travis-ci.org/shaunc/ember-declarative)

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Declarative components

A declarative component is a component that wraps a block of declarations,
which are not incorporated directly into the final component, but serve
as raw material, directing the construction of the final DOM representation.

Declarations can specify options, and contain sub-blocks which control
how fragments of content are rendered. The overall component serves
as a compiler, reorganizing the options and DOM fragments from the 
declarations into a final rendering.

Declarative components allow the customization of different parts of an interface. They 
can provide complex functionality in a more reusable manner than
traditional block components.

## An example

The example application defines a merge component, which allows its
user to declare how to display items of separate sublists, then displays them
as one sorted overall list. For example, if the user has the following data structure:

    data = {
      vegetable: ['apple', 'lettuce', 'pear'],
      animal: ['bear', 'goat', 'zebra']
    }

The example `merge-lists` component can be used like:

    {{#merge-lists data=data }}

      {{#merge-item list='vegetable' as |item|}}
        <li style="color:green">{{item}}</li>
      {{/merge-item}}

      {{#merge-item list='animal' as |item|}}
        <li style="color:red">{{item}}</li>
      {{/merge-item}}

    {{/merge-lists}}

This will result in final html rendered as (with "id" elements suppressed):

    <ul>
      <li style="color:green">apple</li>
      <li style="color:red">bear</li>
      <li style="color:red">goat</li>
      <li style="color:green">lettuce</li>
      <li style="color:green">pear</li>
      <li style="color:red">zebra</li>
    </ul>

To accomplish this, the block of declarations are rendered
using `display:none`. Then the merge list template defines
an "implementation" section, which renders the overall list, and
moves the DOM nodes from the declaration to the list.

### TODO

This example should be extended to incorporate update of lists.

## API

Declarative components are a very flexible design pattern. Currently, these utilities
are fairly minimal, and, of course, are not necessary to implement your own declarative
components. As declarative components become more common (whether or not they
use these utilities), we hope to learn what aspects of their design are generalizable,
and add support here.

### DeclarationBlock

Declaration block is a container for declarations. At a minimum, declarative
component authors can use it to hide declarations, as it will render with `display:none`. The
main template of a declarative component can look like:

    {{#delcaration-block}}{{yield}}{{/declaration-block}}

    {{! implementation goes here }}

`DeclarationBlock` takes `declarations` and `register` as attributes; the former
is an array of declarations collected; the latter is a listener to collect declarations.
Declarations are configured by default to register with `declarationBlock`, by calling
the `registerDeclaration(decl)` in their `didInsertElement` hook to collect declarations.

### DeclarationBase

Mix in `DeclarationBase` to define a declaration. It will override
`didInsertElement` to look up a declarative wrapper in the parent views above
itself, set its `declarationContainer` attribute to the parent, and register
itself using  `registerDeclaration` (passing itself as an argument). By
default, `DeclarationBase` finds the first enclosing `parentView` which
is an instance of `DeclarationBlock`. Declarative component authors may
choose to receive notification directly, by setting `declarationContainerClass`
on their declarations to be the class of the enclosing element to receive
notifications.

For example, in the dummy application, `MergeItem` mixes in `DeclarationBase` and
sets `declarationContainerClass` to `MergeLists`, which in turn declares `registerDeclaration`
to collect which list, and a source for the items.

See the sample application in `tests/dummy` for the details.

### Best Practices

As `registerDeclaration` is called within the render cycle, setting properties
of ember objects can cause problems. One alternative is to use POJOs for
internal datastructures. Although ember doesn't guarantee it, we have found
that ember renders the tree in depth-first order, so declarations will be
processed before the implementation section, making this a possible strategy.

The other alternative is to wrap changes in ember properties in
`Ember.run.scheduleOnce('afterRender', ... )`. Depending on the details
of your bindings you may or may not need to explicitly `rerender()`.

### Utilities

`ember-declarative/utils/dom-util` includes utilities to manipulate the DOM. The
intention is that the components in the implementation render a shell for their
elements, then copy or move nodes from declarations.

#### moveChildren(source, target, replace)

Move children from `source` DOM node to `target` DOM node. If either is
undefined, does nothing. If `replace` is true, then current children of `target`
are removed before new children from `source` are added. Otherwise, new children
are appended to any currently in `target`.

#### removeChildren(source)

Remove all children from DOM node `source`.

#### copyChildren(source, target, replace)

Copy children from `source` DOM node to `target`. If either is undefined, does
nothing. Semantics for `replace` are the same as for `moveChildren`.

## Running the example

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
