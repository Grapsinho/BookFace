import {
  sendAcceptRequest,
  sendRejectRequest,
  sendRequest,
} from "./friends1.js";

const notificationsMenu = document.querySelector(".notifications_modal_body");

let notification_count_element = document.querySelector(".notification_count");
let notification_count = notification_count_element
  ? parseInt(notification_count_element.textContent) || 0
  : 0;

let notification_count_mobile_element = document.querySelector(
  ".notification_count_mobile"
);

function htmlForFriendRequests(
  sender_email,
  sender_avatar,
  sender_first_name,
  sender_last_name,
  sender_id,
  notification_id,
  img_url_saidan
) {
  let img_url = "";

  if (img_url_saidan == "shecvale linki") {
    img_url = `/static/media/${sender_avatar}`;
  } else {
    img_url = `/static${sender_avatar}`;
  }

  return `
        <div class="d-flex align-items-center gap-2 my-3">
          <a href="${location.protocol}//${location.host}/profile/${sender_email}">
            <img
              src="${img_url}"
              style="border-radius: 50%; width: 50px; height: 50px"
            />
          </a>
          <div style="display: flex; flex-direction: column">
            <span style="color: black">${sender_first_name} ${sender_last_name}
            <span style="font-size: 0.9rem">Sent You Friend Request</span>
            </span>
            <div class="d-flex gap-2">
              <button
                class="btn btn-success add_friend_appr"
                data-id="${sender_id}"
                data-notificationId="${notification_id}"
                style="padding: 2px 0; width: 100px"
              >
                Accept
              </button>
              <button
                class="btn btn-danger decline_friend_request"
                data-id="${sender_id}"
                data-notificationId="${notification_id}"
                style="padding: 2px 0; width: 100px"
              >
                Decline
              </button>
            </div>
          </div>
        </div>

      `;
}

function htmlForRejectOrAcceptNotifications(
  sender_first_name,
  sender_last_name,
  notification_id,
  text
) {
  return `
          <p
            style="
              color: black;
              background: #e0e0e0;
              padding: 0.5rem;
              margin-block: 0.5rem;
            "
          >
            ${sender_first_name} ${sender_last_name} ${text}
            <button
              class="delete_message_dec"
              data-id="${notification_id}"
              style="
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.2rem;
                background: none;
                border: none;
              "
              type="button"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="custom-tooltip"
              data-bs-title="Delete Notification"
            >
              🗑️
            </button>
          </p>

      `;
}

// Function to remove a notification
function removeNotification(notification_id, button) {
  const data = {
    notification_id: notification_id,
  };

  sendRequest(
    "/friendship/DeleteNotifications/", // Your API endpoint for sending a friend request
    "POST", // HTTP method
    data, // Data to be sent
    function (response) {
      button.remove();

      notification_count_mobile_element = notification_count_mobile_element
        ? notification_count_mobile_element || notification_count_element
        : notification_count_element;

      let notification_count_mobile = notification_count_mobile_element
        ? parseInt(notification_count_mobile_element.textContent) ||
          notification_count
        : notification_count;

      notification_count--;
      notification_count_mobile--;

      notification_count_mobile_element.textContent = notification_count_mobile;
      notification_count_element.textContent = notification_count;
    },
    function (error) {
      // Error callback
      console.error("Failed to send friend request", error);
      alert(
        error.detail || "An error occurred while sending the friend request."
      );
    }
  );
}

notification_count_mobile_element = notification_count_mobile_element
  ? notification_count_mobile_element || notification_count_element
  : notification_count_element;

let notification_count_mobile = notification_count_mobile_element
  ? parseInt(notification_count_mobile_element.textContent) ||
    notification_count
  : notification_count;

const ws = new WebSocket(`ws://${window.location.host}/ws/notifications/`);

ws.onmessage = function (e) {
  try {
    const notification = JSON.parse(e.data);

    notification_count++;
    notification_count_mobile++;

    notification_count_mobile_element.textContent = notification_count_mobile;
    notification_count_element.textContent = notification_count;

    if (notification.notification_type == "friend_request") {
      notificationsMenu.innerHTML =
        htmlForFriendRequests(
          notification.sender.email,
          notification.sender.avatar,
          notification.sender.first_name,
          notification.sender.last_name,
          notification.sender.id,
          notification.notification_id,
          "daikide"
        ) + notificationsMenu.innerHTML;

      // add accept and reject buttons
      const accept_requests_friend =
        document.querySelectorAll(".add_friend_appr");
      const reject_requests_friend = document.querySelectorAll(
        ".decline_friend_request"
      );

      accept_requests_friend.forEach((element) => {
        element.addEventListener("click", () => {
          const senderId = element.getAttribute("data-id");
          const notificationId = element.getAttribute("data-notificationId");

          sendAcceptRequest(senderId, element, notificationId);
        });
      });

      reject_requests_friend.forEach((element) => {
        element.addEventListener("click", () => {
          const senderId = element.getAttribute("data-id");
          const notificationId = element.getAttribute("data-notificationId");

          sendRejectRequest(senderId, element, notificationId);
        });
      });
    } else if (notification.notification_type == "friend_acceptance") {
      notificationsMenu.innerHTML =
        htmlForRejectOrAcceptNotifications(
          notification.receiver.first_name,
          notification.receiver.last_name,
          notification.notification_id,
          "has accepted your friend request."
        ) + notificationsMenu.innerHTML;
    } else if (notification.notification_type == "friend_rejection") {
      notificationsMenu.innerHTML =
        htmlForRejectOrAcceptNotifications(
          notification.receiver.first_name,
          notification.receiver.last_name,
          notification.notification_id,
          "has rejected your friend request."
        ) + notificationsMenu.innerHTML;
    }

    const delete_message_dec = document.querySelectorAll(".delete_message_dec");

    delete_message_dec.forEach((element) => {
      element.addEventListener("click", () => {
        const notificationId = element.getAttribute("data-id");

        removeNotification(notificationId, element.parentElement);
      });
    });
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
  }
};

const delete_message_dec = document.querySelectorAll(".delete_message_dec");

if (delete_message_dec) {
  delete_message_dec.forEach((element) => {
    element.addEventListener("click", () => {
      const notificationId = element.getAttribute("data-id");

      const notificationContainer = element.closest(
        ".container_for_unfriend_notification"
      );

      if (notificationContainer) {
        removeNotification(notificationId, notificationContainer);
      } else {
        removeNotification(notificationId, element.parentElement);
      }
    });
  });
}

// add accept and reject buttons
const accept_requests_friend = document.querySelectorAll(".add_friend_appr");
const reject_requests_friend = document.querySelectorAll(
  ".decline_friend_request"
);

if (accept_requests_friend) {
  accept_requests_friend.forEach((element) => {
    element.addEventListener("click", () => {
      const senderId = element.getAttribute("data-id");
      const notificationId = element.getAttribute("data-notificationId");

      sendAcceptRequest(senderId, element, notificationId);
    });
  });
}

if (reject_requests_friend) {
  reject_requests_friend.forEach((element) => {
    element.addEventListener("click", () => {
      const senderId = element.getAttribute("data-id");
      const notificationId = element.getAttribute("data-notificationId");

      sendRejectRequest(senderId, element, notificationId);
    });
  });
}

function refreshTokenAndRetry(retryCallback) {
  sendRequest(
    "/auth/token/refresh/",
    "POST",
    {}, // No additional data needed for token refresh
    function (data) {
      console.log("Token refreshed successfully");
      retryCallback(); // Retry the original request after the token is refreshed
    },
    function (error) {
      console.error("Token refresh failed", error);
      if (error.message === "logout qeni") {
        window.location.href = `${location.protocol}//${location.host}/auth/logout/`; // Redirect to logout if needed
      }
    }
  );
}

let offset = 7;
const limit = 6;
let loading = false;
let hasMoreNotifications = true;

function loadNotifications() {
  // Prevent loading if it's already happening or there are no more notifications
  if (loading || !hasMoreNotifications) return;

  loading = true; // Set the loading state to true to avoid multiple requests

  // Use the sendRequest function to fetch the notifications
  sendRequest(
    `/notifications/api/notifications/?limit=${limit}&offset=${offset}`, // URL with limit and offset parameters
    "GET", // HTTP method
    null, // No body needed for GET request
    (data) => {
      if (
        data.detail ===
        "Authentication credentials were not provided or are invalid."
      ) {
        // If authentication fails, refresh the token and retry
        refreshTokenAndRetry(() => loadNotifications());
      } else {
        // Extract notifications and total count from the response
        const notifications = data.notifications;
        const totalCount = data.total_count;

        // Append the fetched notifications to the DOM
        appendNotificationsToDOM(notifications);

        // Update the offset for the next request
        if (notifications.length > 0) {
          offset += limit;
        }

        // If the offset exceeds or equals the total notifications, stop further requests
        if (offset >= totalCount) {
          hasMoreNotifications = false;
        }

        loading = false; // Reset the loading state to allow future requests
      }
    },
    (error) => {
      // Handle any errors that occur during the fetch
      console.error("Error fetching notifications:", error);
      loading = false; // Ensure loading state is reset even after an error
    }
  );
}

function appendNotificationsToDOM(notifications) {
  // A placeholder function to add notifications to the page.
  notifications.forEach((notification) => {
    notification_count++;
    notification_count_mobile++;

    notification_count_mobile_element.textContent = notification_count_mobile;
    notification_count_element.textContent = notification_count;

    if (notification.notification_type == "friend_request") {
      notificationsMenu.innerHTML =
        notificationsMenu.innerHTML +
        htmlForFriendRequests(
          notification.sender_email,
          notification.sender_avatar,
          notification.sender_first_name,
          notification.sender_last_name,
          notification.sender_id,
          notification.id,
          "shecvale linki"
        );

      // add accept and reject buttons
      const accept_requests_friend =
        document.querySelectorAll(".add_friend_appr");
      const reject_requests_friend = document.querySelectorAll(
        ".decline_friend_request"
      );

      accept_requests_friend.forEach((element) => {
        element.addEventListener("click", () => {
          const senderId = element.getAttribute("data-id");
          const notificationId = element.getAttribute("data-notificationId");

          sendAcceptRequest(senderId, element, notificationId);
        });
      });

      reject_requests_friend.forEach((element) => {
        element.addEventListener("click", () => {
          const senderId = element.getAttribute("data-id");
          const notificationId = element.getAttribute("data-notificationId");

          sendRejectRequest(senderId, element, notificationId);
        });
      });
    } else if (notification.notification_type == "friend_acceptance") {
      notificationsMenu.innerHTML =
        notificationsMenu.innerHTML +
        htmlForRejectOrAcceptNotifications(
          notification.sender_first_name,
          notification.sender_last_name,
          notification.id,
          "has accepted your friend request."
        );
    } else if (notification.notification_type == "friend_rejection") {
      notificationsMenu.innerHTML =
        notificationsMenu.innerHTML +
        htmlForRejectOrAcceptNotifications(
          notification.sender_first_name,
          notification.sender_last_name,
          notification.id,
          "has rejected your friend request."
        );
    }
  });

  // add accept and reject buttons
  const accept_requests_friend = document.querySelectorAll(".add_friend_appr");
  const reject_requests_friend = document.querySelectorAll(
    ".decline_friend_request"
  );

  if (accept_requests_friend) {
    accept_requests_friend.forEach((element) => {
      element.addEventListener("click", () => {
        const senderId = element.getAttribute("data-id");
        const notificationId = element.getAttribute("data-notificationId");

        sendAcceptRequest(senderId, element, notificationId);
      });
    });
  }

  if (reject_requests_friend) {
    reject_requests_friend.forEach((element) => {
      element.addEventListener("click", () => {
        const senderId = element.getAttribute("data-id");
        const notificationId = element.getAttribute("data-notificationId");

        sendRejectRequest(senderId, element, notificationId);
      });
    });
  }

  const delete_message_dec = document.querySelectorAll(".delete_message_dec");

  if (delete_message_dec) {
    delete_message_dec.forEach((element) => {
      element.addEventListener("click", () => {
        const notificationId = element.getAttribute("data-id");

        const notificationContainer = element.closest(
          ".container_for_unfriend_notification"
        );

        if (notificationContainer) {
          removeNotification(notificationId, notificationContainer);
        } else {
          removeNotification(notificationId, element.parentElement);
        }
      });
    });
  }
}

const modalBody = document.querySelector("#notificationTabContent");

modalBody.addEventListener("scroll", () => {
  if (modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight) {
    loadNotifications();
  }
});