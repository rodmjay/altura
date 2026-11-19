// Language menu and the pilot sign-up. The form posts only to Altura's Google Form, the same one as before.
(function () {
  var sel = document.getElementById("lang");
  if (sel) sel.addEventListener("change", function () {
    try { localStorage.setItem("ds-lang", sel.value); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.delete("lang");
    location.assign(new URL(sel.dataset.other, location.href).pathname + u.search + u.hash);
  });

  var form = document.getElementById("signup");
  if (!form) return;
  var GFORM_POST = "https://docs.google.com/forms/d/1fXPf_z4kVkfukXg2xg78lBzH7sfH8WV1RGz1lqXXSQc/formResponse";
  var FIELDS = { name: "entry.834802312", email: "entry.900048461", role: "entry.1967550595", goals: "entry.440761807",
    ai: "entry.557930751", month: "entry.55699781", price: "entry.75409784", note: "entry.511433725" };
  var status = document.getElementById("f-status");
  var submit = document.getElementById("f-submit");
  var val = function (id) { return document.getElementById(id).value.trim(); };
  var say = function (msg, bad) { status.textContent = msg; status.classList.toggle("err", !!bad); };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = val("f-name"), email = val("f-email");
    if (!name || !email) { say(form.dataset.needName, true); (name ? document.getElementById("f-email") : document.getElementById("f-name")).focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say(form.dataset.badEmail, true); document.getElementById("f-email").focus(); return; }
    var body = new URLSearchParams();
    body.append(FIELDS.name, name.slice(0, 200));
    body.append(FIELDS.email, email.slice(0, 200));
    [["role", "f-role"], ["ai", "f-ai"], ["month", "f-month"], ["price", "f-price"]].forEach(function (p) {
      var v = val(p[1]); if (v) body.append(FIELDS[p[0]], v.slice(0, 300));
    });
    form.querySelectorAll('input[name="goals"]:checked').forEach(function (c) { body.append(FIELDS.goals, c.value); });
    var note = val("f-note");
    var lang = document.documentElement.lang === "en" ? "" : "Language: Spanish";
    var fullNote = [note, lang].filter(Boolean).join("\n\n").slice(0, 4000);
    if (fullNote) body.append(FIELDS.note, fullNote);
    submit.disabled = true; say(form.dataset.sending);
    fetch(GFORM_POST, { method: "POST", mode: "no-cors", body: body }).then(function () {
      form.hidden = true;
      var done = document.getElementById("done");
      done.hidden = false; done.focus();
    }).catch(function () {
      submit.disabled = false; say(form.dataset.failed, true);
    });
  });
})();
