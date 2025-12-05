// Data Export/Import for Habit Helper
// Provides functionality to backup and restore habits and tracking data

/**
 * Export all habits and tracking data as JSON
 * @returns {Object} Complete data export object
 */
function exportAllData() {
    const habits = getHabits();
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        habits: habits,
        tracking: {}
    };
    
    // Export tracking data for each habit
    habits.forEach(habit => {
        const tracking = getTracking(habit.id);
        if (Object.keys(tracking).length > 0) {
            exportData.tracking[habit.id] = tracking;
        }
    });
    
    // Include milestones if they exist
    exportData.milestones = {};
    habits.forEach(habit => {
        const milestones = getMilestones(habit.id);
        if (milestones && milestones.length > 0) {
            exportData.milestones[habit.id] = milestones;
        }
    });
    
    return exportData;
}

/**
 * Download exported data as JSON file
 */
function downloadDataExport() {
    const data = exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `habit-helper-backup-${timestamp}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Validate imported data structure
 * @param {Object} data - Imported data object
 * @returns {Object} Validation result with status and message
 */
function validateImportData(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, message: 'Invalid data format' };
    }
    
    if (!data.habits || !Array.isArray(data.habits)) {
        return { valid: false, message: 'Missing or invalid habits array' };
    }
    
    // Validate habit structure
    for (const habit of data.habits) {
        if (!habit.id || !habit.name || !habit.createdDate) {
            return { valid: false, message: 'Invalid habit structure' };
        }
    }
    
    return { valid: true, message: 'Data is valid' };
}

/**
 * Import data from backup file
 * @param {Object} importData - Parsed JSON data
 * @param {string} mode - Import mode: 'merge' or 'replace'
 * @returns {Object} Import result with status and message
 */
function importData(importData, mode = 'merge') {
    // Validate data
    const validation = validateImportData(importData);
    if (!validation.valid) {
        return { success: false, message: validation.message };
    }
    
    try {
        if (mode === 'replace') {
            // Replace all existing data
            saveHabits(importData.habits);
            
            // Clear existing tracking data
            const existingHabits = getHabits();
            existingHabits.forEach(habit => {
                localStorage.removeItem(`tracking_${habit.id}`);
                localStorage.removeItem(`milestones_${habit.id}`);
            });
        } else {
            // Merge with existing data
            const existingHabits = getHabits();
            const existingIds = new Set(existingHabits.map(h => h.id));
            
            // Add new habits that don't exist
            const newHabits = importData.habits.filter(h => !existingIds.has(h.id));
            const mergedHabits = [...existingHabits, ...newHabits];
            saveHabits(mergedHabits);
        }
        
        // Import tracking data
        if (importData.tracking) {
            Object.keys(importData.tracking).forEach(habitId => {
                if (mode === 'replace') {
                    saveTracking(habitId, importData.tracking[habitId]);
                } else {
                    // Merge tracking data
                    const existing = getTracking(habitId);
                    const merged = { ...existing, ...importData.tracking[habitId] };
                    saveTracking(habitId, merged);
                }
            });
        }
        
        // Import milestones
        if (importData.milestones) {
            Object.keys(importData.milestones).forEach(habitId => {
                if (mode === 'replace') {
                    saveMilestones(habitId, importData.milestones[habitId]);
                } else {
                    // Merge milestones
                    const existing = getMilestones(habitId) || [];
                    const imported = importData.milestones[habitId] || [];
                    const merged = [...new Set([...existing, ...imported])].sort((a, b) => a - b);
                    saveMilestones(habitId, merged);
                }
            });
        }
        
        return {
            success: true,
            message: `Successfully imported ${importData.habits.length} habit(s)`,
            habitsCount: importData.habits.length
        };
        
    } catch (error) {
        console.error('Error importing data:', error);
        return {
            success: false,
            message: 'Error importing data: ' + error.message
        };
    }
}

/**
 * Handle file input for import
 * @param {File} file - File object from input
 * @param {string} mode - Import mode
 * @param {Function} callback - Callback with result
 */
function handleImportFile(file, mode, callback) {
    if (!file) {
        callback({ success: false, message: 'No file selected' });
        return;
    }
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        callback({ success: false, message: 'Please select a JSON file' });
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            const result = importData(data, mode);
            callback(result);
        } catch (error) {
            callback({
                success: false,
                message: 'Failed to parse JSON file: ' + error.message
            });
        }
    };
    
    reader.onerror = function() {
        callback({
            success: false,
            message: 'Failed to read file'
        });
    };
    
    reader.readAsText(file);
}

/**
 * Get data statistics for display
 * @returns {Object} Statistics about stored data
 */
function getDataStatistics() {
    const habits = getHabits();
    let totalDays = 0;
    let totalCompletions = 0;
    
    habits.forEach(habit => {
        const tracking = getTracking(habit.id);
        const completions = Object.values(tracking).filter(t => t.completed).length;
        totalCompletions += completions;
        totalDays += Object.keys(tracking).length;
    });
    
    return {
        habitsCount: habits.length,
        totalDays: totalDays,
        totalCompletions: totalCompletions,
        storageSize: getStorageSize()
    };
}

/**
 * Get approximate localStorage size
 * @returns {string} Storage size in KB
 */
function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return (total / 1024).toFixed(2) + ' KB';
}

/**
 * Clear all app data (with confirmation)
 * @param {Function} callback - Callback after clearing
 */
function clearAllData(callback) {
    const habits = getHabits();
    
    // Remove all tracking and milestone data
    habits.forEach(habit => {
        localStorage.removeItem(`tracking_${habit.id}`);
        localStorage.removeItem(`milestones_${habit.id}`);
    });
    
    // Remove habits and other app data
    localStorage.removeItem('habits');
    localStorage.removeItem('currentHabitIndex');
    
    if (callback) {
        callback({ success: true, message: 'All data cleared successfully' });
    }
}
