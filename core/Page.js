import { DataType } from '../shared/constants.js';
import { DataLoader } from './DataLoader.js';

export class Page {
	async build() {
		throw new Error('NotImplemented: Page#Build method must be implemented by subclasses.');
	}

	/**
	 * @returns {URLSearchParams}
	 */
	getSearchParams() {
		return new URLSearchParams(window.location.search);
	}

	/**
	 * @param {string} filePath
	 * @param {string} dataType
	 * @returns {Promise<string | any>}
	 */
	async loadPageData(filePath, dataType) {
		const loaderResponse = await DataLoader.loadFile(filePath);
		if (!loaderResponse) {
			return null;
		}

		switch (dataType) {
			case DataType.JSON: {
				return await loaderResponse.json();
			}
			case DataType.TEXT: // fallthrough
			case DataType.HTML: {
				return await loaderResponse.text();
			}
			default: {
				console.error(`Unsupported data type: ${dataType}`);
				return null;
			}
		}
	}
}
