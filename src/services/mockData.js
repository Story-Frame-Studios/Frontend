// Mock data for testing

export const mockJobs = [
  {
    jobId: '1',
    title: 'Frontend Developer',
    companyName: 'Tech Innovations Inc.',
    location: 'Toronto, ON',
    salary: 85000,
    jobType: 'Full-time',
    description: 'We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, TypeScript, and modern CSS frameworks. You will be responsible for building user interfaces, implementing responsive designs, and collaborating with backend developers.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience with React. Proficiency in HTML, CSS, and JavaScript. Experience with responsive design and cross-browser compatibility.',
    applications: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '2',
    title: 'Backend Developer',
    companyName: 'Data Systems Ltd.',
    location: 'Vancouver, BC',
    salary: 95000,
    jobType: 'Full-time',
    description: 'Data Systems is seeking a Backend Developer to design and implement server-side applications. You will work on API development, database design, and system architecture. The ideal candidate should have strong problem-solving skills and experience with Node.js and database technologies.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 4+ years of experience in backend development. Proficiency in Node.js, Express, and MongoDB. Experience with RESTful API design and implementation.',
    applications: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '3',
    title: 'Full Stack Developer',
    companyName: 'WebSolutions Co.',
    location: 'Montreal, QC',
    salary: 90000,
    jobType: 'Full-time',
    description: 'WebSolutions is looking for a Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications from front to back. The ideal candidate should be comfortable working with both client and server-side technologies.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in full stack development. Proficiency in React, Node.js, and SQL databases. Experience with cloud services (AWS, Azure, or GCP).',
    applications: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '4',
    title: 'DevOps Engineer',
    companyName: 'Cloud Experts Inc.',
    location: 'Calgary, AB',
    salary: 100000,
    jobType: 'Full-time',
    description: 'Cloud Experts is seeking a DevOps Engineer to help automate and optimize our infrastructure. You will be responsible for CI/CD pipelines, infrastructure as code, and monitoring systems. The ideal candidate should have experience with cloud platforms and containerization technologies.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 4+ years of experience in DevOps. Proficiency in AWS, Docker, and Kubernetes. Experience with CI/CD tools like Jenkins or GitLab CI.',
    applications: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '5',
    title: 'UI/UX Designer',
    companyName: 'Creative Designs Ltd.',
    location: 'Ottawa, ON',
    salary: 80000,
    jobType: 'Full-time',
    description: 'Creative Designs is looking for a talented UI/UX Designer to create beautiful and functional user interfaces. You will be responsible for user research, wireframing, prototyping, and visual design. The ideal candidate should have a strong portfolio showcasing their design skills.',
    requirements: 'Bachelor\'s degree in Design, HCI, or related field. 3+ years of experience in UI/UX design. Proficiency in Figma, Sketch, or Adobe XD. Experience with user research and usability testing.',
    applications: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '6',
    title: 'Data Scientist',
    companyName: 'Analytics Pro',
    location: 'Toronto, ON',
    salary: 110000,
    jobType: 'Full-time',
    description: 'Analytics Pro is seeking a Data Scientist to analyze complex data sets and extract valuable insights. You will be responsible for developing machine learning models, statistical analysis, and data visualization. The ideal candidate should have strong analytical skills and experience with data science tools.',
    requirements: 'Master\'s degree in Data Science, Statistics, or related field. 3+ years of experience in data science. Proficiency in Python, R, and SQL. Experience with machine learning frameworks like TensorFlow or PyTorch.',
    applications: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '7',
    title: 'Mobile Developer',
    companyName: 'App Innovators',
    location: 'Vancouver, BC',
    salary: 90000,
    jobType: 'Full-time',
    description: 'App Innovators is looking for a Mobile Developer to create native applications for iOS and Android. You will be responsible for app development, testing, and deployment. The ideal candidate should have experience with mobile development frameworks and app store submission processes.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in mobile development. Proficiency in Swift, Kotlin, or React Native. Experience with app store submission and guidelines.',
    applications: [],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '8',
    title: 'QA Engineer',
    companyName: 'Quality Systems Inc.',
    location: 'Edmonton, AB',
    salary: 75000,
    jobType: 'Full-time',
    description: 'Quality Systems is seeking a QA Engineer to ensure the quality of our software products. You will be responsible for test planning, test case development, and automated testing. The ideal candidate should have strong attention to detail and experience with testing methodologies.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in software testing. Proficiency in test automation tools like Selenium or Cypress. Experience with test management tools and bug tracking systems.',
    applications: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '9',
    title: 'Product Manager',
    companyName: 'Product Visionaries',
    location: 'Montreal, QC',
    salary: 105000,
    jobType: 'Full-time',
    description: 'Product Visionaries is looking for a Product Manager to lead the development of our software products. You will be responsible for product strategy, roadmap planning, and feature prioritization. The ideal candidate should have strong leadership skills and experience with product development methodologies.',
    requirements: 'Bachelor\'s degree in Business, Computer Science, or related field. 5+ years of experience in product management. Proficiency in product management tools like Jira or Asana. Experience with agile methodologies and product lifecycle management.',
    applications: [],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    jobId: '10',
    title: 'Technical Writer',
    companyName: 'Documentation Experts',
    location: 'Ottawa, ON',
    salary: 70000,
    jobType: 'Full-time',
    description: 'Documentation Experts is seeking a Technical Writer to create clear and concise documentation for our software products. You will be responsible for user guides, API documentation, and release notes. The ideal candidate should have strong writing skills and experience with documentation tools.',
    requirements: 'Bachelor\'s degree in English, Technical Communication, or related field. 3+ years of experience in technical writing. Proficiency in documentation tools like Markdown, Confluence, or MadCap Flare. Experience with API documentation and style guides.',
    applications: [],
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  }
]; 