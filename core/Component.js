import { DataLoader } from './DataLoader.js';

export class Component {
	// TODO: decide if to use this field for constructing the template's path/id,
	// or have the function receive a path argument that will be used to load the template.
	// if all the components are in a specific folder, we can use this field to construct the path.
	// what about specific page components? they wont be in the root components folder, so it's irrelevant to them
	// instead of every common component repeating the 'components/name/name.js' path, we can create a utility for that.
	// where should that utility be? in the Component class?
	#name;

	constructor(name) {
		this.#name = name;
	}

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
	 * @param {string} templateId
	 * @returns {DocumentFragment}
	 */
	loadTemplate(templateId) {
		/** @type HTMLTemplateElement */
		const template = document.querySelector(`template#${templateId}`);

		return template.content.cloneNode(true);

		return template.content.firstElementChild;
	}

	// TODO: should this component add the component to the DOM/input container?
	// should it only created it and return it?
	// if so, should the rename to something else?
	render() {
		throw new Error('Render method must be implemented in subclass');
	}
}
