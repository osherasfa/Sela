const kanbanData = {
    "STORIES": [
        {
            taskId: crypto.randomUUID(),
            taskTitle: "User Authentication",
            taskDescription: "Implement login and sign up pages using JWT.",
            subTasks: ["Design login page UI", "Create backend auth routes", "Setup DB connection"],
            taskTags: ["Backend", "Frontend", "Auth"]
        },
        {
            taskId: crypto.randomUUID(),
            taskTitle: "Database Migration",
            taskDescription: "Migrate database tables to support new user roles.",
            subTasks: ["Create migration scripts", "Test rollback functionality"],
            taskTags: ["Database", "Backend"]
        }
    ],
    "TODO": [
        {
            taskId: crypto.randomUUID(),
            taskTitle: "Dark Mode Support",
            taskDescription: "Add dark mode toggle to the dashboard header.",
            subTasks: ["Define dark mode colors", "Create toggle button component"],
            taskTags: ["Frontend", "UI/UX"]
        },
        {
            taskId: crypto.randomUUID(),
            taskTitle: "API Documentation",
            taskDescription: "Document all endpoints with Swagger/OpenAPI.",
            subTasks: ["Setup Swagger UI", "Write path docs"],
            taskTags: ["Documentation", "API"]
        },
        {
            taskId: crypto.randomUUID(),
            taskTitle: "Dark Mode Support",
            taskDescription: "Add dark mode toggle to the dashboard header.",
            subTasks: ["Define dark mode colors", "Create toggle button component"],
            taskTags: ["Frontend", "UI/UX"]
        }
    ],
    "IN PROGRESS": [
        {
            taskId: crypto.randomUUID(),
            taskTitle: "Drag and Drop",
            taskDescription: "Implement drag and drop for cards between columns.",
            subTasks: ["Install library", "Implement sensors", "Test card movement"],
            taskTags: ["Frontend", "Feature"]
        }
    ],
    "DONE": [
        {
            taskId: crypto.randomUUID(),
            taskTitle: "Project Setup",
            taskDescription: "Initialize React app with Vite and configure build tools.",
            subTasks: ["Configure package.json", "Setup Tailwind CSS", "Verify developer setup"],
            taskTags: ["DevOps", "Frontend"]
        }
    ]
};

export default kanbanData;

