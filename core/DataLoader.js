export class DataLoader {
	/**
	 *
	 * @param {string} filePath
	 * @param {string} dataType
	 */
	// static async loadFileFromServer(filePath, dataType) {
	// 	try {
	// 		const response = await fetch(filePath);
	// 		if (!response.ok) {
	// 			const error = await response.text();
	// 			console.error(`Error loading file from server: ${filePath}: ${error}`);
	// 			return null;
	// 		}

	// 		switch (dataType) {
	// 			case DataType.JSON: {
	// 				return await response.json();
	// 			}
	// 			case DataType.TEXT: // fallthrough
	// 			case DataType.HTML: {
	// 				return await response.text();
	// 			}
	// 			default:
	// 				console.error(`Unsupported data type: ${dataType}`);
	// 				return null;
	// 		}
	// 	} catch (error) {
	// 		console.error(`Error loading file from server: ${filePath}`, error);
	// 		return null;
	// 	}
	// }

	/**
	 * Loads a file from the file system
	 * @param {string} filePath
	 * @returns {Promise<Response | null>}
	 */
	static async loadFile(filePath) {
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				const error = await response.text();
				console.error(`Error loading file from server: ${filePath}: ${error}`);
				return null;
			}
			return response;
		} catch (error) {
			console.error(`Error loading file: ${filePath}`, error);
			return null;
		}
	}

	/**
	 * @param {string} path
	 * @returns {Promise<string | null>}
	 */
	static async loadComponent(path) {
		const response = await DataLoader.loadFile(path);
		if (!response) {
			return null;
		}

		try {
			const component = await response.text();
			return component;
		} catch (error) {
			console.error(`Error loading component from path: ${path}`, error);
			return null;
		}
	}
}
