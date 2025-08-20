export type Lecturer = {
	name: string;
	position: string;
	field: string;
	email: string;
	linkedinLink: string;
	googleScholarLink: string;
	facebookLink: string;
	githubLink: string;
	cvFile: string;
	addresses: {
		university: string;
		hours: string;
	}[];
};

export type GeneralInfo = {
	biography: string;
	researchInterests: string;
	featuredPublications: AcademicPublication[];
	currentProjects: Project[];
};

export type Project = {
	name: string;
	description: string;
	topic: string;
	link: FileLink;
};

export type AcademicPublication = {
	name: string;
	description: string;
	authors: string;
	year: number;
	publisher: string;
	publicationStatus: string;
	topic: string;
	type: string;
	citations: number;
	fileLinks: FileLink[];
};

export type FileLink = {
	info: string;
	type: string; // TODO: change the numeric types into something more descriptive (maybe use an enum)
	string: string;
};

export type Blog = {
	title: string;
	description: string;
	fileLinks: FileLink[];
	year: number;
	month: number;
	day: number;
};

export type Resource = {
	name: string;
	description: string;
	recommendation: string;
	fileLinks: FileLink[];
	authors: string;
	year: number;
	topic: string;
	type: string;
};

export type Research = {
	name: string;
	description: string;
	startYear: number;
	startMonth: number;
	endYear: number;
	endMonth: number;
	teamMembers: number;
	participants: ResourceParticipant[];
	relevantResources: any[]; // TODO: define a more specific type for relevant resources
};

type ResourceParticipant = Lecturer & {
	role: string;
};
