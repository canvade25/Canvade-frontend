const fs = require('fs');

function fixController(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to replace the userSnapshot query
  // from:
  /*
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const user = userSnapshot.docs[0].data();
  */
  
  // Actually, let's just do a regex replace on the specific lines to inject the multi-query logic.
  
  const searchPattern1 = /const (userSnapshot|snapshot) = await db\s*\.collection\("users"\)\s*\.where\("email", "==", email\)\s*\.limit\(1\)\s*\.get\(\);/g;
  
  const replacement = `
    let $1 = await db.collection("users").where("email", "==", email).limit(1).get();
    
    if ($1.empty) {
      $1 = await db.collection("users").where("phoneNumber", "==", email).limit(1).get();
    }
    if ($1.empty && !email.startsWith("+")) {
      $1 = await db.collection("users").where("phoneNumber", "==", "+91" + email).limit(1).get();
    }
  `;

  content = content.replace(searchPattern1, replacement);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixed " + filePath);
}

fixController("/Users/store/CanvadeBackend/src/controllers/auth/auth.controller.js");
fixController("/Users/store/CanvadeBackend/src/controllers/student/user.controller.js");
