import { sendRequest } from "./utility.js";

// Function to preview the profile picture
document
  .getElementById("newProfilePictureInput__profile")
  .addEventListener("change", function (event) {
    const [file] = event.target.files;
    if (file) {
      const preview = document.getElementById(
        "newProfilePicturePreview__profile"
      );
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block"; // Show the preview image

      document.querySelector("#currentProfilePicture__profile").style.display =
        "none"; // Hide the current profile picture
    }
  });

// Function to preview the background picture
document
  .getElementById("newBackgroundPictureInput__profile")
  .addEventListener("change", function (event) {
    const [file] = event.target.files;
    if (file) {
      const preview = document.getElementById(
        "newBackgroundPicturePreview__profile"
      );
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block"; // Show the preview image

      document.querySelector(
        "#currentBackgroundPicture__profile"
      ).style.display = "none"; // Hide the current background picture
    }
  });

// don't want to send anything if input is null

const every_input__pictures_profile = document.querySelectorAll(
  ".every_input__pictures"
);

every_input__pictures_profile.forEach((element) => {
  if (element.value) {
    document.querySelector(
      ".savechanges__forUpdatePictures__profile"
    ).style.pointerEvents = "all";
  } else {
    document.querySelector(
      ".savechanges__forUpdatePictures__profile"
    ).style.pointerEvents = "none";
  }

  element.addEventListener("input", () => {
    const input = element.value;

    if (input) {
      document.querySelector(
        ".savechanges__forUpdatePictures__profile"
      ).style.pointerEvents = "all";
    } else {
      document.querySelector(
        ".savechanges__forUpdatePictures__profile"
      ).style.pointerEvents = "none";
    }
  });
});

// Function to submit the form via AJAX
function submitForm__edit_profile() {
  var formData = new FormData(document.getElementById("edit-profile-form")); // Create FormData from the form

  formData.append("avatar_no", "");
  formData.append("background_image_no", "");

  if (formData.get("avatar").name == "") {
    formData.delete("avatar");
    formData.set("avatar_no", "araris");
  } else if (formData.get("background_image").name == "") {
    formData.delete("background_image");
    formData.set("background_image_no", "araris");
  }

  $.ajax({
    type: "POST",
    url: `${location.protocol}//${location.host}/profile/Update-Profile-Pictures/`,
    headers: {
      "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
    },
    data: formData,
    processData: false, // Do not process the data
    contentType: false, // Let jQuery set the correct content type for FormData
    success: function (response) {
      // Handle success (e.g., show a success message)
      console.log(response);

      if (response.redirect_url) {
        window.location.href = "/";
      }
    },
    error: function (xhr) {
      if (
        xhr.responseJSON?.detail ===
        "Authentication credentials were not provided or are invalid."
      ) {
        refreshTokenAndRetry__edit_profile(); // Refresh the token and retry the form submission
      } else {
        // Handle other errors (e.g., show an error message)
        console.error("Error while updating profile", xhr);
      }
    },
  });
}

// Function to refresh the token and retry form submission
function refreshTokenAndRetry__edit_profile() {
  $.ajax({
    type: "POST",
    url: `${location.protocol}//${location.host}/auth/token/refresh/`,
    headers: {
      "X-CSRFToken": csrftoken, // Include CSRF token
    },
    success: function (data) {
      console.log("Token refreshed successfully", data);
      submitForm__edit_profile(); // Retry form submission after refreshing token
    },
    error: function (error) {
      console.error("Token refresh failed", error);
      if (error.responseJSON?.message === "logout qeni") {
        window.location.href = `${location.protocol}//${location.host}/auth/logout/`;
      }
    },
  });
}

// Attach an event listener to the form submission
$(document).ready(function () {
  $("#edit-profile-form").on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission
    submitForm__edit_profile(); // Submit the form via AJAX
  });
});

////////////////////////// set cover or profile pictures /////////////////////////

// აქ ვუშვებთ sendRequest ფუნქციას და გადავცემთ საჭირო არგუმენტებს
function setCoverOrProfilePicture(media_id, value) {
  const data = {};
  data["type"] = value;
  data["mediaId"] = media_id;

  sendRequest(
    "/profile/SetCoverOrProfile/", // Your API endpoint
    "POST", // მეთოდი
    data, // რას ვაგზავნით
    function (response) {
      // თუ ყველაფერი წარმატებით დასრულდა

      window.location.href = "/";

      if (value == "profile") {
      } else if (value == "background") {
      }
    },
    function (xhr) {
      // ერრორის დროს რა მოხდება
      if (
        xhr.responseJSON?.detail ===
        "Authentication credentials were not provided or are invalid."
      ) {
        // ვარეფრეშებთ ტოკენს
        refreshTokenAndRetry(() => setCoverOrProfilePicture(media_id, value)); // Retry after refreshing token
      }

      if (xhr.responseJSON?.detail === "Media object not found.") {
        alert("Media object not found.");
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

const setCover__btns = document.querySelectorAll(".setCover-btn");
const setProfile__btns = document.querySelectorAll(".setProfile-btn");

setCover__btns.forEach((element) => {
  element.addEventListener("click", () => {
    const media_id = element.dataset.id;

    setCoverOrProfilePicture(media_id, "background");
  });
});

setProfile__btns.forEach((element) => {
  element.addEventListener("click", () => {
    const media_id = element.dataset.id;

    setCoverOrProfilePicture(media_id, "profile");
  });
});

////////////////////////// set cover or profile pictures DONE /////////////////////////
