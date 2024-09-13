// JavaScript to handle image click and modal display
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".media-images .photo-grid img");

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `<button class="modal-close">&times;</button><img src="" alt="Enlarged Image" />`;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");
  const closeModal = modal.querySelector(".modal-close");

  images.forEach((image) => {
    image.addEventListener("click", () => {
      modalImg.src = image.src;
      modal.classList.add("open");
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  // Close modal if clicked outside of the image
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
    }
  });

  // ends here

  // Open the chat window when a friend is clicked
  document.querySelectorAll(".friend").forEach((friend) => {
    friend.addEventListener("click", function () {
      const chatWindow = document.getElementById("chat-window");
      const chatFriendName = document.getElementById("chat-friend-name");
      const friendName = friend.getAttribute("data-name");
      chatFriendName.textContent = `Chat with ${friendName}`;

      chatWindow.classList.remove("chat-hidden");

      scrollToBottom();
    });
  });

  // Close the chat window
  document.getElementById("close-chat").addEventListener("click", function () {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.classList.add("chat-hidden");
  });
});

function scrollToBottom() {
  const chatContainer = document.querySelector(".chat-body");
  chatContainer.scrollTop =
    chatContainer.scrollHeight - chatContainer.clientHeight;
}

// ends here

// location and job btn
const location_btn23 = document.querySelector(".add-location-btn");
const job_btn = document.querySelector(".add-job-btn");

const job_input = document.querySelector(".input-and-add-button-job");
const location_input = document.querySelector(".input-and-add-button-location");

const job_input2 = document.querySelector(".input-and-add-button-job2");
const location_input2 = document.querySelector(
  ".input-and-add-button-location2"
);

const bio_input = document.querySelector(".input-and-add-button-bio");

$(".add-location-btn").on("click", function () {
  location_btn23.style.display = "none";

  location_input.classList.remove("d-none");
});

$(".add-job-btn").on("click", function () {
  job_btn.style.display = "none";

  job_input.classList.remove("d-none");
});

$(".update_profile_info__location").on("click", function () {
  if (location_input2.classList.contains("d-none")) {
    location_input2.classList.remove("d-none");
  } else {
    location_input2.classList.add("d-none");
  }
});

$(".update_profile_info__job").on("click", function () {
  if (job_input2.classList.contains("d-none")) {
    job_input2.classList.remove("d-none");
  } else {
    job_input2.classList.add("d-none");
  }
});

$(".update_profile_info__bio").on("click", function () {
  if (bio_input.classList.contains("d-none")) {
    bio_input.classList.remove("d-none");
  } else {
    bio_input.classList.add("d-none");
  }
});

// ფუნქცია რომელიც გვეხმარება გავზავნოთ რექუესთი
function sendRequest(url, method, data, successCallback, errorCallback) {
  $.ajax({
    type: method,
    url: `${location.protocol}//${location.host}${url}`,
    headers: {
      "X-CSRFToken": csrftoken,
    },
    data: JSON.stringify(data),
    contentType: "application/json",
    credentials: "include",
    success: successCallback,
    error: errorCallback,
  });
}

// აქ ვუშვებთ sendRequest ფუნქციას და გადავცემთ საჭირო არგუმენტებს
function updateProfileField(field, value) {
  const data = {};
  data[field] = value;

  sendRequest(
    "/profile/Update-Job-Or-Location/", // Your API endpoint
    "POST", // მეთოდი
    data, // რას ვაგზავნით
    function (response) {
      // თუ ყველაფერი წარმატებით დასრულდა

      if (field == "job") {
        $(".input-and-add-button-job").remove();
        $(".job-txt").text(response.what_updated);
      } else if (field == "location") {
        $(".input-and-add-button-location").remove();
        $(".location-txt").text(response.what_updated);
      } else if (field == "bio") {
        $(".input-and-add-button-bio").remove();
        $(".bio-txt").text(response.what_updated);
      }
    },
    function (xhr) {
      // ერრორის დროს რა მოხდება
      console.error(`Failed to update ${field}`, xhr);
      if (
        xhr.responseJSON?.detail ===
        "Authentication credentials were not provided or are invalid."
      ) {
        // ვარეფრეშებთ ტოკენს
        refreshTokenAndRetry(() => updateProfileField(field, value)); // Retry after refreshing token
      }
    }
  );
}

// ტოკენის რეფრეში
function refreshTokenAndRetry(retryCallback) {
  sendRequest(
    "/auth/token/refresh/",
    "POST",
    {},
    function (data) {
      console.log("Token refreshed successfully", data);
      retryCallback(); // Retry original request after token refresh
    },
    function (error) {
      console.error("Token refresh failed", error);
      if (error.responseJSON?.message === "logout qeni") {
        window.location.href = `${location.protocol}//${location.host}/auth/logout/`;
      }
    }
  );
}

// Handle click events for job and location buttons
$(document).ready(function () {
  $(".add-location-submit").on("click", function (e) {
    e.preventDefault();
    const location = $(".location-input").val();
    if (location) {
      updateProfileField("location", location);
    }
  });

  $(".add-job-submit").on("click", function (e) {
    e.preventDefault();
    const job = $(".job-input").val();
    if (job) {
      updateProfileField("job", job);
    }
  });

  $(".add-bio-submit").on("click", function (e) {
    e.preventDefault();
    const bio = $(".bio-input").val();
    if (bio) {
      updateProfileField("bio", bio);
    }
  });
});

// ends here

/////////////////////////////// delete media ///////////////////////////

function deleteImages(mediaId) {
  sendRequest(
    "/profile/Delete_Images/", // Your API endpoint
    "POST", // მეთოდი
    mediaId, // რას ვაგზავნით
    function (response) {
      window.location.href = "/";
    },
    function (xhr) {
      // ერრორის დროს რა მოხდება
      console.error(xhr);
      if (
        xhr.responseJSON?.detail ===
        "Authentication credentials were not provided or are invalid."
      ) {
        // ვარეფრეშებთ ტოკენს
        refreshTokenAndRetry(() => deleteImages(mediaId)); // Retry after refreshing token
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  // Select all the menu buttons
  const menuButtons = document.querySelectorAll(".menu-btn");

  menuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Find the dropdown menu within the same container and toggle visibility
      const dropdownMenu = this.nextElementSibling;
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });
  });

  // Add event listener to delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const mediaId = this.getAttribute("data-id");
      deleteImages(mediaId);
      this.closest(".image-container__media_profile").remove();
    });
  });
});

//////////////////////////// ends here /////////////////////////////
