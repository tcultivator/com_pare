type alertNotificationType = {
    message: string;
    alertType: 'success' | 'error' | 'base' | 'warning';
}

export function signupValidation({ username, password, confirmPassword }: { username: string, password: string, confirmPassword: string }) {

    let alertNotification: alertNotificationType = {message:'',alertType:'base'};
    let allWarningMessage: string[] = [];

    // Check if username is empty
    if (!username.trim()) allWarningMessage.push('Username is required!');

    // Check if password is empty
    if (!password.trim()) allWarningMessage.push('Password is required!');

    // Check if confirmPassword is empty
    if (!confirmPassword.trim()) allWarningMessage.push('Confirm password is required!');

    if (username && password && confirmPassword) {
        const pwd = password;

        if(username.length < 3) allWarningMessage.push('Username must be at least 3 characters');

        if(username.length > 20) allWarningMessage.push('Username cannot exceed 20 characters');

        // Check if passwords match
        if (password !== confirmPassword) allWarningMessage.push('Password and Confirm Password do not match');

        // Minimum length
        if (pwd.length < 8) allWarningMessage.push('Password must be at least 8 characters');

        // Number
        if (!/[0-9]/.test(pwd)) allWarningMessage.push('Password must contain at least one number');

        // No spaces
        if (/\s/.test(pwd)) allWarningMessage.push('Password cannot contain spaces');
    }

    // Combine all warnings into a single message string
    if (allWarningMessage.length > 0) {
        alertNotification = {
            message: allWarningMessage.join('\n'), // each warning on a new line
            alertType: 'warning'
        };
    }

    return allWarningMessage.length > 0 ? alertNotification : null;
}