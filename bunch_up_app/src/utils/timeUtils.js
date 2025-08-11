/**
 * 时间格式化工具
 * 实现聊天界面的时间显示逻辑
 */

// 获取时间段的文字描述
function getTimePeriod(hours) {
  if (hours >= 5 && hours < 12) return '上午';
  if (hours >= 12 && hours < 18) return '下午';
  if (hours >= 18 && hours < 24) return '晚上';
  return '凌晨';
}

// 格式化小时和分钟
function formatTime(hours, minutes) {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// 获取星期几的中文描述
function getWeekday(date) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${weekdays[date.getDay()]}`;
}

// 判断是否为同一天
export function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// 判断是否为昨天
function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

// 判断是否在一周内
function isWithinWeek(date) {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  return date > weekAgo;
}

// 判断是否为当前年份
function isCurrentYear(date) {
  return date.getFullYear() === new Date().getFullYear();
}

/**
 * 会话列表时间格式化
 * 24小时制：当天的消息直接显示"时分"；大于今天、小于等于昨天直接显示"昨天"。
 * 大于昨天而小于等于一周时显示"星期几"（一周是从接收最后一条消息开始算）
 */
export function formatSessionTime(timestamp) {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // 当天的消息
  if (isSameDay(messageDate, now)) {
    return formatTime(messageDate.getHours(), messageDate.getMinutes());
  }
  
  // 昨天的消息
  if (isYesterday(messageDate)) {
    return '昨天';
  }
  
  // 一周内的消息
  if (isWithinWeek(messageDate)) {
    return getWeekday(messageDate);
  }
  
  // 一周以后的消息
  if (isCurrentYear(messageDate)) {
    return `${messageDate.getMonth() + 1}月${messageDate.getDate()}日`;
  } else {
    return `${messageDate.getFullYear()}年${messageDate.getMonth() + 1}月${messageDate.getDate()}日`;
  }
}

/**
 * 聊天界面时间格式化
 * 当天消息：以每5分钟为一个跨度显示时间，5分钟内连续讨论的消息，不在讨论信息之间显示时间，
 * 只在第1条信息顶端显示时间（没有日期，只有上午、下午等时段+时间）；
 * 超过5分钟的聊天，则在信息顶端显示时间（没有日期，只有时段+时间）。
 * 非当天消息：如果是昨天收发的信息，显示为"昨天+小时+分钟"；
 * 如果是一周以内、两天之前，显示为"星期几+小时+分钟"；
 * 如果是一周以后，显示为"年月日+小时+分钟"，若为当前年份，可只显示"月日+小时+分钟"。
 * 跨天情况：如果是日期上跨天，则在跨天的第1条信息显示日期。
 */
export function formatChatTime(timestamp, showDate = false) {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // 当天的消息
  if (isSameDay(messageDate, now)) {
    const timePeriod = getTimePeriod(messageDate.getHours());
    const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
    return `${timePeriod} ${time}`;
  }
  
  // 昨天的消息
  if (isYesterday(messageDate)) {
    const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
    return `昨天 ${time}`;
  }
  
  // 一周内的消息
  if (isWithinWeek(messageDate)) {
    const weekday = getWeekday(messageDate);
    const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
    return `${weekday} ${time}`;
  }
  
  // 一周以后的消息
  const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
  if (isCurrentYear(messageDate)) {
    return `${messageDate.getMonth() + 1}月${messageDate.getDate()}日 ${time}`;
  } else {
    return `${messageDate.getFullYear()}年${messageDate.getMonth() + 1}月${messageDate.getDate()}日 ${time}`;
  }
}

/**
 * 判断是否需要显示时间
 * 用于聊天界面，判断当前消息是否需要显示时间
 */
export function shouldShowTime(currentMessage, previousMessage, timeSpan = 5 * 60 * 1000) {
  if (!previousMessage) return true; // 第一条消息显示时间
  
  const currentTime = new Date(currentMessage.sendTime || currentMessage.timestamp);
  const previousTime = new Date(previousMessage.sendTime || previousMessage.timestamp);
  
  // 如果跨天，显示时间
  if (!isSameDay(currentTime, previousTime)) return true;
  
  // 如果超过5分钟，显示时间
  const timeDiff = currentTime.getTime() - previousTime.getTime();
  return timeDiff > timeSpan;
}

/**
 * 获取完整的日期时间显示
 * 用于跨天情况下的日期显示
 */
export function formatFullDateTime(timestamp) {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // 当天的消息
  if (isSameDay(messageDate, now)) {
    const timePeriod = getTimePeriod(messageDate.getHours());
    const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
    return `${timePeriod} ${time}`;
  }
  
  // 昨天的消息
  if (isYesterday(messageDate)) {
    const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
    return `昨天 ${time}`;
  }
  
  // 一周内的消息
  if (isWithinWeek(messageDate)) {
    const weekday = getWeekday(messageDate);
    const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
    return `${weekday} ${time}`;
  }
  
  // 一周以后的消息
  const time = formatTime(messageDate.getHours(), messageDate.getMinutes());
  if (isCurrentYear(messageDate)) {
    return `${messageDate.getMonth() + 1}月${messageDate.getDate()}日 ${time}`;
  } else {
    return `${messageDate.getFullYear()}年${messageDate.getMonth() + 1}月${messageDate.getDate()}日 ${time}`;
  }
}
