import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})

export class HeaderTitleService {
	private title: string;

	constructor (private titleService: Title) {}

	getTitle (): string {
		return this.title;
	}

	setTitle (title: string): void {
		this.title = title;
	}

	setHeaderTitle (title: string): void {
		this.titleService.setTitle(title);
	}
}
