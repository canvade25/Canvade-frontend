// src/utils/constants.js

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
};

export const EMOJI_OPTIONS = [
  "😀",
  "😂",
  "😊",
  "😍",
  "👍",
  "🙏",
  "🎉",
  "🔥",
  "💯",
  "❤️",
  "🙌",
  "✅",
];

// Sidebar sections — later these map to:
// Joined   -> accepted chats/groups the user is part of
// Requests -> chat requests, group join requests, group invitations
// Global   -> public/discoverable groups & institutes
export const SIDEBAR_SECTIONS = ["Global", "Joined", "Requests"];

// Tabs within each sidebar section
export const CHAT_TABS = ["Groups", "Individuals"];

export const MESSAGE_OPTIONS = ["Select", "Edit", "Copy", "Reply", "Delete Message"];

export const getChatItemOptions = (activeSidebar, activeTab) => {
  if (activeSidebar === "Global" && activeTab === "Groups") {
    return ["Join Group"];
  }
  if (activeSidebar === "Global" && activeTab === "Individuals") {
    return ["Send Chat Request"];
  }
  return [
    "Select",
    ...(activeTab === "Individuals" ? ["Edit"] : []),
    "Copy",
    "Reply",
    "Delete Chat",
  ];
};

export const getProfileOptions = (activeTab) => [
  "Mute Notifications",
  "Clear Chat",
  "Delete Conversation",
  ...(activeTab === "Groups" ? ["Leave Group"] : []),
  "Block",
  "Unblock",
];

export const REQUEST_ACTIONS = ["Accept", "Reject", "Block"];

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------
// Shape is intentionally close to a Firestore "conversations" collection:
// each chat/group is a document with a `messages` subcollection.
// `courseId` is reserved for future institute/course queries.
export const INITIAL_DATA = {
  Joined: {
    Groups: [
      {
        id: 1,
        name: "Amnec Studio (Animation group)",
        msg: "Today's class will be a theoretical test...",
        time: "1m",
        active: "3 Active",
        color: "#D1FAE5",
        textColor: "#065F46",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "Today's class gonna be the theoretical test and everyone should be prepared.",
            type: "received",
            time: "11:45",
          },
          {
            id: 2,
            text: "All the students are requested to be present in the class.",
            type: "received",
            time: "11:52",
          },
          {
            id: 3,
            text: "Okay sir, I have a few doubts regarding today's topics. If possible, could you please give us a few minutes to clear them? It would really help us understand the concepts better and perform well in the test.",
            type: "sent",
            time: "12:05",
          },
          {
            id: 4,
            text: "Not today, but in the next class we will have a doubt-solving session.",
            type: "received",
            time: "12:10",
          },
        ],
      },
      {
        id: 2,
        name: "Ignou M.tech 1st year",
        msg: "Exam is going to be soon...",
        time: "25m",
        active: "5 Active",
        color: "#DBEAFE",
        textColor: "#1E40AF",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "guys... Exam is going to be soon. does any one have idea which topic is really Im......",
            type: "received",
            time: "10:20",
          },
          {
            id: 2,
            text: "Bro same I have no clue ",
            type: "sent",
            time: "10:22",
          },
        ],
      },
      {
        id: 9,
        name: "Ignou M.tech Notes",
        msg: "Anyone interested in buying 1st sem notes...",
        time: "1h",
        active: "0 Active",
        color: "#F3E8FF",
        textColor: "#7E22CE",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "Anyone interested in buying 1st sem notes it will make really easy for you to prepare.",
            type: "received",
            time: "09:00",
          },
        ],
      },
    ],
    Individuals: [
      {
        id: 3,
        name: "Sohail Bhati",
        msg: "Hey, did you check the portfolio?",
        time: "2h",
        active: "Online",
        color: "#E5E7EB",
        textColor: "#374151",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "Hey, did you check the portfolio?",
            type: "received",
            time: "08:30",
          },
          {
            id: 2,
            text: "Yes! Looks amazing bro ",
            type: "sent",
            time: "08:35",
          },
        ],
      },
      {
        id: 4,
        name: "Komal Sharma",
        msg: "The chat UI looks great!",
        time: "5h",
        active: "Offline",
        color: "#FCE7F3",
        textColor: "#9D174D",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "The chat UI looks great!",
            type: "received",
            time: "07:00",
          },
          {
            id: 2,
            text: "Thanks! Still polishing it ",
            type: "sent",
            time: "07:10",
          },
        ],
      },
    ],
  },
  Requests: {
    Groups: [
      {
        id: 5,
        name: "New Design Team",
        msg: "Request to join...",
        time: "1d",
        active: "Pending",
        color: "#FEF9C3",
        textColor: "#92400E",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "You have a pending join request for this group.",
            type: "received",
            time: "Yesterday",
          },
        ],
      },
    ],
    Individuals: [
      {
        id: 6,
        name: "Rahul Verma",
        msg: "Wants to connect",
        time: "3d",
        active: "New",
        color: "#FEE2E2",
        textColor: "#991B1B",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "Hi! I'd like to connect with you.",
            type: "received",
            time: "3 days ago",
          },
        ],
      },
    ],
  },
  Global: {
    Groups: [
      {
        id: 7,
        name: "Public Tech Forum",
        msg: "Welcome to global chat",
        time: "Now",
        active: "100+ Active",
        color: "#CFFAFE",
        textColor: "#155E75",
        courseId: null,
        messages: [
          {
            id: 1,
            text: "Welcome to the Public Tech Forum! Feel free to discuss anything tech-related.",
            type: "received",
            time: "Now",
          },
        ],
      },
    ],
    Individuals: [],
  },
};