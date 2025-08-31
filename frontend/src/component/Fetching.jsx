export const GetCourses = async () => {
  const access_token = localStorage.getItem("access");
  try {
    const res = await fetch("http://localhost:5000/getCourses", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`,  // ✅ token bhejna zaruri hai
      },
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error(data.message);
      }
      throw new Error(data.message);
    }

    
    return data.course_list;
  }
  catch (error) {
    console.error("Error fetching courses:", error.message);
    return error.message;
  }
};


export async function Updating(name, data, id) {
  const access_token = localStorage.getItem("access");
  const fetching = await fetch("http://localhost:5000/updateCourses", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization" :  `Bearer ${access_token}`
     },
    body: JSON.stringify({
      [name]: data,
      id: id
    })
  });
  return fetching.json();
}

export async function GetMessage() {
  const access_token = localStorage.getItem("access");
      try {
        const data = await fetch("http://localhost:5000/getQuestions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,  // ✅ token bhejna zaruri hai
      },
    })
        return data.json()
      }
      catch (err) {
        return data.message
  }
}
export const refreshingToken = async (data) => {
  if (data === "ACCESS_TOKEN_EXPIRED") {
    const refresh_token = localStorage.getItem("refresh")
    if (!refresh_token) return null // agar refresh token missing hai

    try {
      const res = await fetch("http://localhost:5000/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refresh_token}`
        }
      })

      if (res.ok) {
        const refreshed = await res.json()
        if (refreshed?.access) {
          localStorage.setItem("access", refreshed.access)
          return refreshed.access
        }
      } else {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        alert("Session expired, please login again")
          window.location.href = "/Account"
      }
    } catch (err) {
      console.error("Refresh error:", err)
    }
  }
  return null
}
