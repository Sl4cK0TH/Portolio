# Git Commit Guide

This guide explains the Git commands used to save and push your work to GitHub.

---

## 📋 Basic Git Workflow

### 1. Check Status
```bash
git status
```
**Explanation:** Shows which files have been modified, added, or deleted since your last commit.

### 2. Add Files to Staging Area
```bash
git add .
```
**Explanation:** Adds ALL modified files to the staging area (preparing them for commit).
- `.` means "all files in current directory"
- Alternative: `git add filename.txt` to add specific files only

### 3. Commit Changes
```bash
git commit -m "Your commit message here"
```
**Explanation:** Saves your staged changes to your local repository with a descriptive message.
- `-m` flag allows you to add a message inline
- Message should be clear and describe what you changed
- Example: `git commit -m "Added interactive terminal with networking tools"`

### 4. Push to GitHub
```bash
git push origin main
```
**Explanation:** Uploads your local commits to GitHub's remote repository.
- `origin` = the remote repository (GitHub)
- `main` = the branch name you're pushing to

---

## 🚀 Quick Commands (All-in-One)

```bash
git add . && git commit -m "Your message" && git push origin main
```
**Explanation:** Combines all three commands into one line using `&&` (run next command only if previous succeeds).

---

## 📊 Useful Git Commands

### View Commit History
```bash
git log
```
**Explanation:** Shows all previous commits with their messages, authors, and dates.
- Press `q` to exit the log view

### View Short Commit History
```bash
git log --oneline
```
**Explanation:** Shows condensed commit history (one line per commit).

### See What Changed
```bash
git diff
```
**Explanation:** Shows line-by-line changes in your modified files before staging.

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```
**Explanation:** Undoes your last commit but keeps all changes in staging area.

### Discard All Local Changes
```bash
git reset --hard HEAD
```
**Explanation:** ⚠️ **DANGER!** Permanently deletes all uncommitted changes. Use carefully!

---

## 🌿 Branch Commands

### Create New Branch
```bash
git branch feature-name
```
**Explanation:** Creates a new branch for working on a feature without affecting main code.

### Switch to Branch
```bash
git checkout feature-name
```
**Explanation:** Switches your working directory to the specified branch.

### Create and Switch (Shortcut)
```bash
git checkout -b feature-name
```
**Explanation:** Creates a new branch and immediately switches to it.

### Merge Branch into Main
```bash
git checkout main
git merge feature-name
```
**Explanation:** First switch to main branch, then merge your feature branch into it.

---

## 🔄 Syncing with GitHub

### Pull Latest Changes
```bash
git pull origin main
```
**Explanation:** Downloads and merges changes from GitHub to your local repository.

### Fetch Without Merging
```bash
git fetch origin
```
**Explanation:** Downloads changes from GitHub but doesn't merge them yet (safer than pull).

---

## 🛠️ GitHub CLI Commands (Using `gh`)

### Create Repository
```bash
gh repo create RepoName --public --source=. --remote=origin --push
```
**Explanation:** 
- `--public` = Makes repo public (use `--private` for private)
- `--source=.` = Uses current directory
- `--remote=origin` = Sets up remote named "origin"
- `--push` = Automatically pushes initial commit

### View Repository
```bash
gh repo view
```
**Explanation:** Opens your repository in the browser or shows info in terminal.

### Create Issue
```bash
gh issue create --title "Bug report" --body "Description here"
```
**Explanation:** Creates a new issue on GitHub directly from terminal.

---

## 📝 Best Practices

### Good Commit Messages
✅ **Good:**
- "Added About page with terminal interface"
- "Fixed footer spacing and font size"
- "Implemented networking tools (ping, nmap, whois)"

❌ **Bad:**
- "updated stuff"
- "changes"
- "asdfasdf"

### Commit Frequency
- Commit after completing a feature
- Commit when you have working code
- Don't commit broken/non-functional code to main branch

### Before Committing
1. Test your changes
2. Check for errors
3. Remove debug code/console.logs
4. Review what you're committing with `git status` and `git diff`

---

## 🔥 Common Issues & Solutions

### Merge Conflicts
```bash
# Edit conflicting files manually
git add .
git commit -m "Resolved merge conflicts"
```

### Forgot to Pull Before Push
```bash
git pull origin main
# Resolve any conflicts
git push origin main
```

### Want to Change Last Commit Message
```bash
git commit --amend -m "New message"
git push --force origin main  # ⚠️ Only if you haven't shared the commit
```

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub CLI Manual](https://cli.github.com/manual/)

---

**💡 Tip:** Create an alias for frequently used commands in your `.bashrc` or `.zshrc`:
```bash
alias gac="git add . && git commit -m"
alias gp="git push origin main"
```
Then use: `gac "commit message" && gp`
