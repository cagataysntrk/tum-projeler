export type NotificationType = 'price_alert' | 'daily_report' | 'weekly_report' | 'system';
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';
export type NotificationStatus = 'unread' | 'read';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationRule {
  id: string;
  userId: string;
  paperType: string;
  region?: string;
  condition: 'above' | 'below' | 'change_percent';
  value: number;
  channels: NotificationChannel[];
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  data?: {
    paperType?: string;
    region?: string;
    value?: number;
    oldValue?: number;
    changePercent?: number;
  };
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    in_app: boolean;
  };
  dailyDigest: boolean;
  weeklyReport: boolean;
  priceAlerts: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
} 