const fs = require('fs');
const path = require('path');
const pages = ['index.html', 'map.html', 'nearest.html', 'report.html', 'complaint.html', 'directory.html', 'helpline.html', 'emergency.html', 'admin.html'];

pages.forEach(page => {
    const p = path.join(__dirname, page);
    try {
        let content = fs.readFileSync(p, 'utf8');
        if (!content.includes('localStorage.getItem(\'token\')') && !content.includes('localStorage.getItem("token")')) {
            let script = `\n  <script>\n    if (!localStorage.getItem('token')) {\n      window.location.href = 'login.html';\n    }\n  </script>`;
            if (page === 'admin.html') {
                script = `\n  <script>\n    const u = localStorage.getItem('user');\n    if (!u || JSON.parse(u).role !== 'admin') {\n      window.location.href = 'index.html';\n    }\n  </script>`;
            }
            content = content.replace('<head>', `<head>${script}`);
            fs.writeFileSync(p, content);
            console.log('Updated ' + page);
        }
    } catch (err) {
        console.error('Failed ' + page, err.message);
    }
});
