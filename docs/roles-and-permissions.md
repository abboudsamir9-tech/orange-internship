# Roles and Permissions

## Admin

### Can

- Create Mentor accounts
- Create Intern accounts
- Assign interns to mentors
- View all mentors
- View interns grouped under each mentor
- View all internship programs
- View program content (read-only)
- Monitor task activity
- Monitor submission activity
- Monitor weekly report activity
- Monitor final summary activity
- Access overall system insights
- Manage user accounts
- Deactivate user accounts
- Reactivate intern accounts
- Delete or deactivate users
- Delete or archive programs

### Cannot

- Edit internship program content
- Generate roadmaps
- Approve roadmaps
- Review task submissions
- Score interns
- Approve weekly reports
- Approve final summaries

---

## Mentor

### Can

- Manage more than one internship program
- Create internship programs
- Manage programs created by them
- Manage assigned interns
- Generate AI learning roadmaps
- Choose roadmap scope (PROGRAM, GROUP, INDIVIDUAL)
- Review AI-generated roadmaps
- Edit AI-generated roadmaps
- Publish roadmaps
- Assign tasks
- Create tasks manually
- Assign one task to multiple interns
- Manage task deadlines
- Change task deadlines after assignment
- Review submissions
- Provide feedback
- Assign scores out of 100
- Generate AI weekly performance reports
- Review weekly reports
- Edit weekly reports
- Regenerate weekly reports
- Approve weekly reports
- Generate final internship summaries
- Review final summaries
- Add final score or comments
- Approve final summaries
- Download final summaries as PDF

---

## Intern

### Can

- Access the internship program assigned by their mentor
- View weekly learning objectives
- View assigned tasks
- Update their individual task status
- Submit written responses
- Upload files
- Make multiple submissions for the same task assignment
- View mentor feedback
- View their task score
- View approved weekly performance reports
- View their approved final internship summary
- Download or view the final summary where allowed

### Constraints

- Belongs to only one program during the MVP
- Has one mentor
- After the program ends, the intern account is deactivated (Admin can reactivate later)
