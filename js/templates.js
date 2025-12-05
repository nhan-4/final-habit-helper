// Habit Templates for Habit Helper
// Pre-defined habit templates for quick-start

/**
 * Collection of pre-defined habit templates
 */
const HABIT_TEMPLATES = [
    {
        id: 'exercise',
        name: 'Morning Exercise',
        icon: '💪',
        description: 'Start your day with 15 minutes of exercise',
        notificationTime: '07:00',
        frequency: 'daily',
        category: 'Health & Fitness'
    },
    {
        id: 'water',
        name: 'Drink Water',
        icon: '💧',
        description: 'Stay hydrated by drinking a glass of water',
        notificationTime: '09:00',
        frequency: 'daily',
        category: 'Health & Fitness'
    },
    {
        id: 'reading',
        name: 'Read 10 Pages',
        icon: '📚',
        description: 'Read at least 10 pages of a book',
        notificationTime: '20:00',
        frequency: 'daily',
        category: 'Learning'
    },
    {
        id: 'meditation',
        name: 'Meditate',
        icon: '🧘',
        description: 'Practice mindfulness meditation for 10 minutes',
        notificationTime: '08:00',
        frequency: 'daily',
        category: 'Mindfulness'
    },
    {
        id: 'journal',
        name: 'Journal',
        icon: '📝',
        description: 'Write in your journal for 5 minutes',
        notificationTime: '21:00',
        frequency: 'daily',
        category: 'Mindfulness'
    },
    {
        id: 'language',
        name: 'Learn Language',
        icon: '🗣️',
        description: 'Practice a new language for 15 minutes',
        notificationTime: '18:00',
        frequency: 'daily',
        category: 'Learning'
    },
    {
        id: 'walk',
        name: 'Take a Walk',
        icon: '🚶',
        description: 'Go for a 20-minute walk',
        notificationTime: '17:00',
        frequency: 'daily',
        category: 'Health & Fitness'
    },
    {
        id: 'gratitude',
        name: 'Practice Gratitude',
        icon: '🙏',
        description: 'List 3 things you\'re grateful for',
        notificationTime: '22:00',
        frequency: 'daily',
        category: 'Mindfulness'
    },
    {
        id: 'workout',
        name: 'Gym Workout',
        icon: '🏋️',
        description: 'Complete your gym workout routine',
        notificationTime: '06:00',
        frequency: 'custom',
        daySelection: [1, 3, 5], // Mon, Wed, Fri
        category: 'Health & Fitness'
    },
    {
        id: 'music',
        name: 'Practice Instrument',
        icon: '🎸',
        description: 'Practice your musical instrument',
        notificationTime: '19:00',
        frequency: 'daily',
        category: 'Creative'
    },
    {
        id: 'art',
        name: 'Create Art',
        icon: '🎨',
        description: 'Spend time drawing, painting, or creating',
        notificationTime: '19:00',
        frequency: 'custom',
        daySelection: [0, 3, 6], // Sun, Wed, Sat
        category: 'Creative'
    },
    {
        id: 'code',
        name: 'Code Practice',
        icon: '💻',
        description: 'Practice coding for 30 minutes',
        notificationTime: '20:00',
        frequency: 'daily',
        category: 'Learning'
    },
    {
        id: 'stretch',
        name: 'Stretch',
        icon: '🤸',
        description: 'Do stretching exercises for flexibility',
        notificationTime: '22:00',
        frequency: 'daily',
        category: 'Health & Fitness'
    },
    {
        id: 'breakfast',
        name: 'Eat Healthy Breakfast',
        icon: '🥗',
        description: 'Start your day with a nutritious breakfast',
        notificationTime: '08:00',
        frequency: 'daily',
        category: 'Health & Fitness'
    },
    {
        id: 'sleep',
        name: 'Sleep Early',
        icon: '😴',
        description: 'Go to bed by a set time',
        notificationTime: '22:30',
        frequency: 'daily',
        category: 'Health & Fitness'
    }
];

/**
 * Get all habit templates
 * @returns {Array} Array of habit template objects
 */
function getHabitTemplates() {
    return HABIT_TEMPLATES;
}

/**
 * Get templates by category
 * @param {string} category - Category name
 * @returns {Array} Filtered templates
 */
function getTemplatesByCategory(category) {
    return HABIT_TEMPLATES.filter(template => template.category === category);
}

/**
 * Get all unique categories
 * @returns {Array} Array of category names
 */
function getTemplateCategories() {
    const categories = [...new Set(HABIT_TEMPLATES.map(t => t.category))];
    return categories.sort();
}

/**
 * Get template by ID
 * @param {string} id - Template ID
 * @returns {Object|null} Template object or null
 */
function getTemplateById(id) {
    return HABIT_TEMPLATES.find(template => template.id === id) || null;
}

/**
 * Create habit from template
 * @param {string} templateId - Template ID
 * @returns {Object} Habit object ready to save
 */
function createHabitFromTemplate(templateId) {
    const template = getTemplateById(templateId);
    if (!template) return null;
    
    const now = new Date();
    const habitId = now.getTime().toString();
    
    return {
        id: habitId,
        name: template.name,
        createdDate: now.toISOString().split('T')[0],
        notificationTime: template.notificationTime,
        frequency: template.frequency,
        daySelection: template.daySelection || []
    };
}

/**
 * Display templates in UI
 * @param {HTMLElement} container - Container element to display templates
 * @param {Function} onSelectCallback - Callback when template is selected
 */
function displayTemplates(container, onSelectCallback) {
    if (!container) return;
    
    const categories = getTemplateCategories();
    container.innerHTML = '';
    
    categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'template-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryTitle.className = 'template-category-title';
        categorySection.appendChild(categoryTitle);
        
        const templatesGrid = document.createElement('div');
        templatesGrid.className = 'templates-grid';
        
        const templates = getTemplatesByCategory(category);
        templates.forEach(template => {
            const templateCard = createTemplateCard(template, onSelectCallback);
            templatesGrid.appendChild(templateCard);
        });
        
        categorySection.appendChild(templatesGrid);
        container.appendChild(categorySection);
    });
}

/**
 * Create a template card element
 * @param {Object} template - Template object
 * @param {Function} onSelectCallback - Callback when clicked
 * @returns {HTMLElement} Template card element
 */
function createTemplateCard(template, onSelectCallback) {
    const card = document.createElement('button');
    card.className = 'template-card';
    card.setAttribute('type', 'button');
    card.setAttribute('aria-label', `Select ${template.name} template`);
    
    card.innerHTML = `
        <div class="template-icon">${template.icon}</div>
        <div class="template-name">${template.name}</div>
        <div class="template-description">${template.description}</div>
    `;
    
    card.addEventListener('click', () => {
        if (onSelectCallback) {
            onSelectCallback(template);
        }
    });
    
    return card;
}
