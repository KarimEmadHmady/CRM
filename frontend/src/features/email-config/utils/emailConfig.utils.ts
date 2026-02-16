export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const validateEmailConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.name || config.name.trim().length < 2) {
    errors.push('Configuration name is required (minimum 2 characters)');
  }

  if (!config.fromName || config.fromName.trim().length < 2) {
    errors.push('From name is required (minimum 2 characters)');
  }

  if (!config.fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.fromEmail)) {
    errors.push('Valid from email is required');
  }

  if (config.provider === 'gmail') {
    if (!config.gmail?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.gmail.email)) {
      errors.push('Valid Gmail email is required');
    }
    if (!config.gmail?.password || config.gmail.password.length < 6) {
      errors.push('Gmail password is required (minimum 6 characters)');
    }
  } else if (config.provider === 'smtp') {
    if (!config.smtp?.host || config.smtp.host.trim().length < 3) {
      errors.push('SMTP host is required');
    }
    if (!config.smtp?.port || config.smtp.port < 1 || config.smtp.port > 65535) {
      errors.push('Valid SMTP port is required (1-65535)');
    }
    if (!config.smtp?.auth?.user || config.smtp.auth.user.trim().length < 1) {
      errors.push('SMTP username is required');
    }
    if (!config.smtp?.auth?.pass || config.smtp.auth.pass.length < 1) {
      errors.push('SMTP password is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
