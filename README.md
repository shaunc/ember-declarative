# Ember-declarative

Utilities for the creation of declarative components.

[![Build Status](https://travis-ci.org/shaunc/ember-declarative.svg)](https://travis-ci.org/shaunc/ember-declarative)

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Declarative components

A declarative component allows the user to declare how pieces of the final 
DOM representation will look using a block of _declarations_. The component
compiles the DOM snippets in the declarations into a final DOM tree
in its implementation. 

Declarative components allow more comprehensive customization
of complex components. By allowing the user to customize many
different aspects of a component, the resulting component is
easier to adapt and reuse.

Examples of declarative components include 
[ember-grid](https://github.com/shaunc/ember-grid)
and [ember-smenu](https://github.com/shaunc/ember-smenu). The later
uses `ember-declarative`; the former should soon.

## Example

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

[Actually, in the current example implementation each "li" is wrapped
in a div. We may clean this up a some point.]

To accomplish this, the block of declarations are rendered
using `display:none`. Then the merge list template defines
an "implementation" section, which renders the overall list, and
moves the DOM nodes from the declaration to the list.

### TODO

This example should be extended to incorporate update of lists.

## How it works

The `merge-list` component has a template:

		{{! merge-lists }}
		
		{{#declaration-block}}{{yield}}{{/declaration-block}}
		
		<ul>
		  {{#each merged as |item|}}
		    {{merge-lists/render-item item=item portalIndex=item.index}}
		  {{/each}}
		</ul>

The declarations (`merge-item` blocks in this case) render the individual
lists, and attach themselves to the `merge-list` data-structure. `merge-list`
itself creates a merged list of items which it passes through 
`merge-lists/render-item`. This component finds the `merge-item`, asks
for its content, and inserts it underneath its own element.

To accomplish this without too much boiler-plate, 
`merge-item` and `render-item` mix in `PortalDeclaration` and `PortalRender` 
(respectively), and `merge-list` mixes in `DeclarationContainer`. 

In more detail, `PortalDeclaration`:

1) Upon receiving attributes, it finds enclosing `DeclarationContainer`, 
and registers itself, also setting its "declarationContainer" property.

2) It sets up an observer of a property on `declarationContainer`
to watch for updates on. Since we are not wiring via public attributes
(so users don't have to patch together our data-flow for us when
they declare `merge-item`s), glimmer will not know to rerender
us otherwise.

3) It attaches itself to a property of `declarationContainer`
(specified by `portalContainer`).

When `merge-lists/render-item` renders, `PortalRender` finds
the property on declarationContainer (stored in `item.source`):
as the implementation block is specified in the `merge-lists`
template, we can explicitly pass the data here. It asks
`merge-item` for its content via `PortalDeclaration.portElements()`
and copies the appropriate child node (guided by `portalIndex`)
into its own node.

## API

Declarative components are a very flexible design pattern. Currently, these utilities
are fairly minimal, and, of course, are not necessary to implement your own declarative
components. As declarative components become more common (whether or not they
use these utilities), we hope to learn what aspects of their design are generalizable,
and add support here.

### `DeclarationBlock`

Declaration block is a container for declarations. Currently, it simply wraps declarations
in `display:none`: handling registrations is done by the overall component. 

### `DeclarationContainer`

Keeps a list of declarations, and provides `registerDeclaration(declaration)` for
declarations to register themselves.

### `DeclarationBase`

`DeclarationBase` is base mixin of `DeclarationPortal`. It handles the registration
process. By default it looks up through the `parentView` chain for the first component that
implements `DeclarationContainer`. A concrete implementation can specify
`declarationContainerClass` or `declarationContainerMixin` to override this. 

* `didRegisterDeclaration()`

Callback called after registeration.

* `updateDeclaration`

Call to explicitly update component. An implementation is provided by `DeclarationPortal`

### `PortalDeclaration`

Has a number of properties to configure:

* `portalContainer`

Data-structure to attach self to.

* `portalAttribute`

Attribute to use in `portalContainer`.

* `portalElementClass` (optional)

css class name to filter own content with. (Useful when iterating over a block
of content so that `PortalRender` can avoid text nodes and pick out the right content.

* `watchAttribute`: attribute of `declarationContainer` to watch to trigger update.

* `notifyAttribute`: update will be accomplished by calling `notifyPropertyChange`
on this attribute of self.

#### Isn't that a lot of wires?

`PortalDeclaration` could use a little "convention over configuration" magic. We
hope to simplify these options when we know what the best conventions are.

### `PortalRender`

* `portal`

Property containing the `PortalDeclaration` instance from which we want
to get content.

* `portalIndex`

Which of the nodes from `PortalDeclaration` to insert. (Default 0).

* `copyChildren`

If true (default), DOM nodes are copied rather than moved. If you set
to false, you have to be careful on updates.

### Utilities

`ember-declarative/utils/dom-util` includes utilities to manipulate the DOM. The
intention is that the components in the implementation render a shell for their
elements, then copy or move nodes from declarations.

#### `moveChildren(source, target, replace)`

Move children from `source` DOM node to `target` DOM node. If either is
undefined, does nothing. If `replace` is true, then current children of `target`
are removed before new children from `source` are added. Otherwise, new children
are appended to any currently in `target`.

#### `removeChildren(source)`

Remove all children from DOM node `source`.

#### `copyChildren(source, target, replace)`

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