import { pascalCaseToKebabCase } from '../utils/case-converter.js';
import { DataLoader } from './DataLoader.js';

export class Component {
	#name;

	constructor(name) {
		this.#name = name;
	}

	/**
	 * @returns {DocumentFragment}
	 */
	loadTemplate() {
		const templateId = pascalCaseToKebabCase(this.#name);

		/** @type HTMLTemplateElement */
		const template = document.querySelector(`template#${templateId}`);
		return template.content.cloneNode(true);
	}

	render() {
		throw new Error('Render method must be implemented in subclass');
	}
}
