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
	 * @returns
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

	// /**
	//  *
	//  * @param {string} path
	//  */
	// static async loadComponent(path) {
	// 	const response = await DataLoader.loadFile(path);
	// 	if (!response) {
	// 		return null;
	// 	}

	// 	try {
	// 		const component = await response.text();
	// 		return component;
	// 	} catch (error) {
	// 		console.error(`Error loading component from path: ${path}`, error);
	// 		return null;
	// 	}
	// }

	static async loadHeader() {
		const response = await DataLoader.loadFile('partials/header.html');
		if (!response) {
			return null;
		}

		try {
			return await response.text();
		} catch (error) {
			console.error(`Error loading header from path: partials/header.html`, error);
			return null;
		}
	}

	static async loadFooter() {
		const response = await DataLoader.loadFile('partials/footer.html');
		if (!response) {
			return null;
		}

		try {
			return await response.text();
		} catch (error) {
			console.error(`Error loading footer from path: partials/footer.html`, error);
			return null;
		}
	}
}
