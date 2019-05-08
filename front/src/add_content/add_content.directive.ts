import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[add-content]',
})
export class AddContentDirective {
	constructor(public viewContainerRef: ViewContainerRef) {}
}
