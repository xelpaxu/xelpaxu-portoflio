import type { ProjectCaseStudy } from '@/types/project';

export const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  vecpro: {
    overview: [
      'Vecpro is our thesis project connecting mosquito breeding-site reporting with a web-based surveillance workflow. It brings together two applications: Aedex for mobile field reporting and Aedify for reviewing and organizing the information collected.',
      'The project follows a report from its capture in the field to its use on a dashboard. Location, images, and report details give reviewers context, while mapping, assignments, and analytics help organize the next steps. The mobile and web applications share a Convex backend.',
    ],
    audience: 'Field reporters, community users, and vector-surveillance teams.',
    goal: 'Connect field observations with a coordinated review and response workflow.',
    features: [
      { title: 'Capture observations in the field', description: 'Aedex provides mobile capture and reporting flows that bring images and location into a surveillance report.' },
      { title: 'Review reports in context', description: 'Aedify provides report views and maps so dashboard users can examine observations alongside their geographic context.' },
      { title: 'Coordinate follow-up work', description: 'Assignments, reporting views, and analytics support the operational work surrounding the submitted observations.' },
    ],
    workflow: ['Capture and submit a field observation through Aedex.', 'Review the report and its location in Aedify.', 'Organize assignments and use the dashboard to follow the reporting activity.'],
    technicalNotes: ['Next.js powers Aedify; Expo and React Native power Aedex.', 'Convex connects application data across the web and mobile workflows.'],
  },
  visaia: {
    overview: [
      'VISAIA brings farm records and pest monitoring into a mobile application for farmers. It connects the setup of farms and fields with the day-to-day work of recording activities, managing crop cycles, and documenting observations.',
      'The application is organized around the farming lifecycle rather than a single detection screen. Farmers can define their field context, record what happens during a growing cycle, and use image-based pest scouting alongside their existing farm information.',
    ],
    audience: 'Farmers, farm managers, and agricultural practitioners.',
    goal: 'Keep farm activity and pest observations together in a mobile workflow.',
    features: [
      { title: 'Define farms and growing areas', description: 'Farm and field setup establishes the location and crop context that subsequent activities and observations belong to.' },
      { title: 'Follow a crop cycle', description: 'Growing cycles and routine activity logs provide a record of operations from planting through the rest of the season.' },
      { title: 'Scout and report pests', description: 'Image-based pest detection and reporting flows let farmers document field observations and review the resulting information.' },
    ],
    workflow: ['Set up a farm, its fields, and the crops being grown.', 'Manage growing cycles and record daily farm activities.', 'Capture pest observations and review reports and notifications.'],
    technicalNotes: ['Flutter and Dart provide the mobile interface.', 'Firebase services support authentication, application records, and image storage.'],
  },
  'visaia-dashboard': {
    overview: [
      'VISAIA Dashboard is the administrative side of a pest-monitoring system. It gives Municipal Agricultural Offices and regional crop-protection administrators distinct workflows for working with farmers, farms, pest reports, and advisories.',
      'Its role is to turn individual reports into information that can be reviewed across an area. Maps supply geographic context, validation tools support report review, and analytics and exports make the information available beyond an individual dashboard screen.',
    ],
    audience: 'Municipal agricultural staff and regional crop-protection administrators.',
    goal: 'Bring pest surveillance, report review, and agricultural administration into one workspace.',
    features: [
      { title: 'Role-specific workspaces', description: 'Municipal and regional users have separate dashboards and navigation suited to their respective responsibilities.' },
      { title: 'Geospatial report review', description: 'Leaflet maps bring together farm locations, pest reports, risk zones, and geographic layers during monitoring and review.' },
      { title: 'Farmer records and regional reporting', description: 'Farmer management, growing-cycle records, advisories, charts, and export tools support administrative and reporting tasks.' },
    ],
    workflow: ['Open the workspace associated with an agricultural role.', 'Inspect reports, farms, and mapped risk information.', 'Validate observations, prepare advisories, and export relevant reports.'],
    technicalNotes: ['Next.js and TypeScript organize the dashboard interface.', 'Firebase supports application data; Leaflet and chart components present geographic and analytical views.'],
  },
  amogus: {
    overview: [
      'Amogus is a multiplayer social-deduction game built around a shared room and information that differs between players. Its interface takes players from choosing an identity to joining a lobby, discovering a role, and participating in a game session.',
      'The application separates the social setup from the active game experience. A React interface handles the screens, while Socket.IO and a Python server coordinate the real-time session and the state players receive.',
    ],
    audience: 'Groups playing a shared online social-deduction game.',
    goal: 'Create a connected multiplayer flow from lobby setup through the result screen.',
    features: [
      { title: 'Player setup and room lobbies', description: 'Players choose an identity and move into a shared lobby before the game begins.' },
      { title: 'Private role information', description: 'Role-reveal screens and player-specific information establish the hidden-role dynamic at the center of the game.' },
      { title: 'Synchronized game sessions', description: 'Real-time communication connects active gameplay and results across the players participating in a room.' },
    ],
    workflow: ['Set up a player identity and join a room.', 'Receive role information when the session starts.', 'Play through the shared game and reach the result screen.'],
    technicalNotes: ['React and TypeScript structure the frontend and its route-based screens.', 'Socket.IO connects the client to the Python game server; Three.js is included in the visual stack.'],
  },
  encast: {
    overview: [
      'enCast is a household energy-use simulation project described in our project document. It is designed to help people understand how the appliances in different rooms contribute to estimated electricity consumption and cost.',
      'Instead of starting with a total bill, the design starts with the home itself: sections, appliances, wattage, and usage time. Users can change those assumptions and explore what-if scenarios. These are input-based estimates rather than readings from a connected electricity meter.',
    ],
    audience: 'Household users exploring appliance usage and electricity costs.',
    goal: 'Make the relationship between appliance habits and estimated energy costs easier to understand.',
    features: [
      { title: 'Organize a home by section', description: 'The specification lets users define rooms or areas and assign appliances with wattage and usage-time information.' },
      { title: 'Explore usage scenarios', description: 'Simulation and calculation tools are designed to show how changes in appliance use affect consumption and cost estimates.' },
      { title: 'Understand the results', description: 'The documented scope includes visual summaries, reminders, and a chatbot for navigation and energy-related guidance.' },
    ],
    workflow: ['Define home sections and enter appliance details.', 'Adjust the usage assumptions in a simulation.', 'Compare the estimated consumption and cost across appliances and sections.'],
    technicalNotes: ['The project document identifies Flutter and Dart as the application stack.', 'The described calculations depend on user-entered information; device-level energy metering is outside the documented core.'],
  },
  memowee: {
    overview: [
      'Memowee is a camera-based face-identification prototype. It combines a browser interface for camera capture and registration with a Python API that compares face embeddings using a TensorFlow model.',
      'The prototype exposes the recognition process through registration controls, an adjustable threshold, and an activity log. A registered profile includes contextual information such as a relationship and short description. It brings capture, registration, and the matching controls together in one interface for experimentation.',
    ],
    audience: 'Users experimenting with camera-based face registration and identification.',
    goal: 'Connect face capture, profile registration, and embedding-based identification in a visible prototype.',
    features: [
      { title: 'Register faces with context', description: 'The registration flow associates a captured face with a name, relationship, and short description.' },
      { title: 'Identify from camera input', description: 'Camera captures are compared with stored profile embeddings by the TensorFlow-backed API.' },
      { title: 'Inspect recognition behavior', description: 'Threshold controls and an activity log make the prototype interaction and identification events visible to the user.' },
    ],
    workflow: ['Register a face and its associated profile information.', 'Capture a face through the browser camera interface.', 'Review identification events and adjust the recognition threshold when testing.'],
    technicalNotes: ['A FastAPI service loads the TensorFlow embedding model and stored profiles.', 'The browser interface uses JavaScript and camera controls to interact with the recognition service.'],
  },
  nexacare: {
    overview: [
      'NexaCare is a desktop healthcare-management application built with Python and Flet. It brings patient information and appointment records into a system with separate interfaces for doctors, administrators, and HR staff.',
      'The application uses role-specific workflows rather than presenting every user with the same set of controls. Patient and appointment models support the records behind those interfaces, while account-management functions support the staff who use the system.',
    ],
    audience: 'Doctors, administrative staff, and HR users managing healthcare records.',
    goal: 'Organize patient information, appointments, and staff access in a desktop application.',
    features: [
      { title: 'Patient information management', description: 'Patient lists and record models provide the foundation for maintaining information used in the healthcare workflow.' },
      { title: 'Appointment records', description: 'Appointment models and related application flows connect scheduling information to the rest of the system.' },
      { title: 'Role-specific access', description: 'Doctor, administrator, and HR dashboards separate the functions presented to each type of staff user.' },
    ],
    workflow: ['Sign in to the appropriate staff account.', 'Work with the patient and appointment information available to that role.', 'Use the relevant administrative interface to manage staff accounts and records.'],
    technicalNotes: ['Flet provides the Python-driven desktop interface.', 'MySQL stores application records through the database and model layers.'],
  },
  revia: {
    overview: [
      'Revia is a study-space discovery and reservation platform for students. Its purpose is to help people find somewhere suitable to study rather than relying on scattered information about locations and availability.',
      'The web application brings browsing, location information, and reservation flows into a single student-facing experience. Mapping and calendar components support the planning side of that journey, while the interface focuses on moving from discovering a space to arranging a study session.',
    ],
    audience: 'Students looking for a suitable place to study.',
    goal: 'Connect study-space discovery with planning and reservation workflows.',
    features: [
      { title: 'Discover study spaces', description: 'Students can explore locations through a web interface designed around finding a place to work.' },
      { title: 'Plan around location and time', description: 'Mapping and calendar components give the discovery and reservation experience spatial and scheduling context.' },
      { title: 'Move into a reservation', description: 'Reservation-related screens connect browsing a study space with the next step of planning a session.' },
    ],
    workflow: ['Browse the available study-space experience.', 'Explore location and scheduling information.', 'Follow the reservation flow for a chosen study space.'],
    technicalNotes: ['React provides the route-based web interface, with Framer Motion for interaction transitions.', 'The application integrates Firebase and Supabase services, along with mapping and calendar components.'],
  },
  'vertex-realty': {
    overview: [
      'Vertex Realty is a real-estate showcase built around browsing properties and examining an individual listing. It combines a property collection, detail pages, and information about the agency into a responsive web experience.',
      'The project gives the listing imagery and information room to lead. Dedicated routes separate browsing from the closer view of a property, while motion and responsive layouts support the transitions between those parts of the site.',
    ],
    audience: 'Visitors exploring property listings and agency information.',
    goal: 'Make moving from a property collection to an individual listing feel clear and cohesive.',
    features: [
      { title: 'Explore the property collection', description: 'A dedicated properties route presents the collection and provides paths into individual listing pages.' },
      { title: 'Inspect an individual listing', description: 'Each property detail route gives the selected listing its own view rather than leaving all information in the collection.' },
      { title: 'Browse across screen sizes', description: 'Responsive layouts, shared navigation, and animated transitions connect the home, agency, and property pages.' },
    ],
    workflow: ['Start with the home page or property collection.', 'Choose a listing and open its dedicated detail page.', 'Continue browsing other properties or explore the agency information.'],
    technicalNotes: ['React and TypeScript organize the application and property data.', 'React Router handles pages, while Framer Motion supports interface transitions.'],
  },
  cictzone: {
    overview: [
      'CICTZONE is a Python 2D game project set in a campus-map environment. It explores the relationship between player movement, map boundaries, obstacles, and the behavior of objects moving through the same space.',
      'Alongside the playable environment, the code includes algorithm-focused work such as A* pathfinding and constraint-based placement. Pygame and Arcade implementations provide different versions of the rendering and movement setup.',
    ],
    audience: 'Players and learners exploring a 2D campus-game environment.',
    goal: 'Combine a navigable game map with experiments in movement and spatial algorithms.',
    features: [
      { title: 'Move through a campus map', description: 'The player navigates a map with keyboard controls, obstacles, and collision boundaries.' },
      { title: 'Explore pathfinding', description: 'The A* implementation uses a grid-based search and heuristic to find paths around obstacles.' },
      { title: 'Work with spatial constraints', description: 'Constraint and placement logic explores how game objects can be arranged while respecting environment rules.' },
    ],
    workflow: ['Start a game implementation and enter the campus environment.', 'Move around the map and its collision boundaries.', 'Explore how obstacles, pathfinding, and object placement affect the environment.'],
    technicalNotes: ['Python implements the game logic and algorithms.', 'The project contains both Pygame and Arcade implementations rather than a single combined game engine.'],
  },
  'bigbrew-pos': {
    overview: [
      'BigBrew POS is a Python point-of-sale application for a drinks-ordering workflow. It connects product selection and order building with payment handling, transaction records, and sales-reporting views.',
      'The application separates ordering from the administrative screens around it. A cashier-facing order window handles the immediate transaction, while product, dashboard, and report views support the work that happens before and after an order is placed.',
    ],
    audience: 'Cashiers and staff working with drink orders and sales records.',
    goal: 'Connect order entry with payment calculations and the records needed to review sales.',
    features: [
      { title: 'Build a drinks order', description: 'The order window provides product selection and order-review controls as part of the cashier workflow.' },
      { title: 'Handle the payment step', description: 'Payment-method controls, paid-amount input, and change calculation support completion of the transaction.' },
      { title: 'Manage and review operations', description: 'Product management, recorded transactions, dashboards, and report screens provide the supporting administrative views.' },
    ],
    workflow: ['Sign in and open the ordering workspace.', 'Choose products, review the order, and enter payment information.', 'Review the resulting transaction through the available records and reports.'],
    technicalNotes: ['Python and Flet provide the application logic and interface.', 'Database helpers connect order entry to product, transaction, and reporting data.'],
  },
};
