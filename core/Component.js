import { pascalCaseToKebabCase } from '../utils/case-converter.js';
import { DataLoader } from './DataLoader.js';

export class Component {
	#name;

	constructor(name) {
		this.#name = name;
	}

	// TODO: remove this function
	// /**
	//  * @param {string} path
	//  */
	// async loadTemplate(path) {
	// 	const template = await DataLoader.loadComponent(path);

	// 	const parser = new DOMParser();
	// 	const doc = parser.parseFromString(template, 'text/html');
	// 	const templateElement = doc.querySelector('template');

	// 	return templateElement.content.firstElementChild;
	// }

	/**
	 * @returns {DocumentFragment}
	 */
	loadTemplate() {
		const templateId = pascalCaseToKebabCase(this.#name);

		/** @type HTMLTemplateElement */
		const template = document.querySelector(`template#${templateId}`);
		return template.content.cloneNode(true);
	}

	// TODO: should this component add the component to the DOM/input container?
	// should it only created it and return it?
	// if so, should the rename to something else?
	render() {
		throw new Error('Render method must be implemented in subclass');
	}
}
