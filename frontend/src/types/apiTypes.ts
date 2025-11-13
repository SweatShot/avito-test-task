// API для модерации объявлений

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  status: "pending" | "approved" | "rejected" | "draft";
  priority: "normal" | "urgent";
  createdAt: string; // date-time
  updatedAt: string; // date-time
  images: string[];
  seller: Seller;
  characteristics: Record<string, string>;
  moderationHistory: ModerationHistory[];
}

export interface Seller {
  id: number;
  name: string;
  rating: string;
  totalAds: number;
  registeredAt: string; // date-time
}

export interface ModerationHistory {
  id: number;
  moderatorId: number;
  moderatorName: string;
  action: "approved" | "rejected" | "requestChanges";
  reason?: string | null;
  comment?: string;
  timestamp: string; // date-time
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface StatsSummary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

export interface ActivityData {
  date: string; // date
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface DecisionsData {
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface ModeratorStats {
  totalReviewed: number;
  todayReviewed: number;
  thisWeekReviewed: number;
  thisMonthReviewed: number;
  averageReviewTime: number;
  approvalRate: number;
}

export interface Moderator {
  id: number;
  name: string;
  email: string;
  role: string;
  statistics: ModeratorStats;
  permissions: string[];
}

// ========== Common API Response Types ==========

export interface BadRequestResponse {
  error: string;
  message: string;
}

export interface NotFoundResponse {
  error: string;
  id: number;
}

export interface InternalServerErrorResponse {
  error: string;
  message: string;
}

// ========== API Endpoint Response Models ==========

export interface GetAdsResponse {
  ads: Advertisement[];
  pagination: Pagination;
}

export interface GetAdByIdResponse extends Advertisement {}

export interface ApproveAdResponse {
  message: string;
  ad: Advertisement;
}

export interface RejectAdResponse {
  message: string;
  ad: Advertisement;
}

export interface RequestChangesResponse {
  message: string;
  ad: Advertisement;
}

export interface StatsSummaryResponse extends StatsSummary {}

export type ActivityChartResponse = ActivityData[];

export interface DecisionsChartResponse extends DecisionsData {}

export interface CategoriesChartResponse {
  [category: string]: number;
}

export interface ModeratorMeResponse extends Moderator {}

// ========== Request Body Types ==========

export interface RejectAdRequest {
  reason:
    | "Запрещенный товар"
    | "Неверная категория"
    | "Некорректное описание"
    | "Проблемы с фото"
    | "Подозрение на мошенничество"
    | "Другое";
  comment?: string;
}

export interface RequestChangesRequest {
  reason:
    | "Запрещенный товар"
    | "Неверная категория"
    | "Некорректное описание"
    | "Проблемы с фото"
    | "Подозрение на мошенничество"
    | "Другое";
  comment?: string;
}

// ========== Query Parameter Types ==========

export interface GetAdsQuery {
  page?: number;
  limit?: number;
  status?: ("pending" | "approved" | "rejected" | "draft")[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "createdAt" | "price" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface StatsQuery {
  period?: "today" | "week" | "month" | "custom";
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}
