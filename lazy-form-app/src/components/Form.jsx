import { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    // Name validation
    if (!form.name) {
      err.name = "Name is required";
    }

    // Email validation
    if (!form.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email format";
    }

    // Password validation
    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      alert("Form Submitted Successfully ✅");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Enter Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <p style={{ color: "red" }}>{errors.name}</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <p style={{ color: "red" }}>{errors.email}</p>
      </div>

      <div>
        <input
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <p style={{ color: "red" }}>{errors.password}</p>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;