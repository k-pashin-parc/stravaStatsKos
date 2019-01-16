import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class HeaderTitleService {
	private title: string;

	getTitle (): string {
		return this.title;
	}

	setTitle (title: string): void {
		this.title = title;
	}
}
