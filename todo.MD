ariel academic website:

[x] create a folder for each page that will contain the .html page, the relevant page .js page and the .css file
	[x] keep the /js/components folder for reused components across many pages.
	[x] components that are only used in a specific page, should be placed inside that page's folder, in a nested components folder
[x] rename pageRender.js to be Page.js
	[x] dont use static methods. have the function return the data
	[x] the pageRender is for rendering the data. create a DataLoader classs for getting the relevant data
	[] the DataLoader will be used in the other script files that aren't page files
[x] create a utils js folder with all the relevant scripts/files
[x] place the common main.js, main.css files inside a /core folder.
[x] rename the root components folder to partials
[x] see what files are not in use and can be removed
	[x] can remove Element.js. it's not doing anything
[x] create core/navigation.js file
[x] create core/cookies.js files
[x] create core/url.js file
[] create constants file for query params (search for ".get(", ".set(", ".append(" function calls for existing query params)
[x] create type for each json file content


advanced:
[] instead of having all the components as js files, create a .js and .html for each component (like angular). the .js extends new class Component, that fetches the .html file, injects props and content and renders it to the page (some methods like render or fetchComponent will be in the base class)
[] move the createListFromJson and createFromJson static methods to the Component class. each sub-component class will implement a "getConstructorParams" function that recieves a data object input and returns an object with the data for the constructor - the constructor destructures the object into the relevant fields

project/
│
├── core/                        # site-wide core assets
│   ├── main.js                  # global JS (header/footer loader, init logic)
│   └── main.css                 # global CSS
|		|-- DataLoader.js
|		|-- PageRender.js
|		|-- AppElement.js
│
├── shared/                      # reusable JS & constants
│   ├── constants.js             # site-wide constants
│   └── components/              # shared JS components
│       ├── NavMenu.js
│       └── Modal.js
│
├── partials/                    # reusable HTML snippets
│   ├── header.html
│   └── footer.html
│
├── home/                        # home page folder
│   ├── index.html
│   ├── home.js                  # page-specific JS
│   ├── home.css                 # page-specific CSS
│   └── components/              # page-specific JS components
│       ├── HeroSlider.js
│       └── FeaturedCard.js
│
├── about/                       # about page folder
│   ├── index.html
│   ├── about.js
│   ├── about.css
│   └── components/
│       ├── TeamCard.js
│       └── Timeline.js
│
└── contact/                     # contact page folder
    ├── index.html
    ├── contact.js
    ├── contact.css
    └── components/
        ├── ContactForm.js
        └── MapEmbed.js


components per page:
index:
	- publicationCard
		- actionButton
	- projectPanel
		- actionButton
	- Icons

about:
	- Icons
	- Tabs
	- projectSection
		- actionButton
	- resources.js
		- actionButton

publications:
	- publicationCard
	- Icons

research:
	- ResearchProject
		- researchTeamMember
		- courseResource
	- ResearchPosition
	- Icons
	- Tabs


