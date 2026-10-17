# **✍️ Quick notes**

## **AI Summit**

Jul 31, 2026  
[Michael Flynn](mailto:mike@powerclouderp.com) [Ron Shaw](mailto:ron@powerclouderp.com) [Justin Lombardi](mailto:justin@powerclouderp.com) [Imran Shabbir](mailto:imran@powerclouderp.com) [Taha Raja](mailto:taha@powerclouderp.com)

The meeting addressed integrating AI tools into consulting workflows and standardizing project management processes for clients.

## **Revenue Recognition and Accounting Strategy**

* Recommended ARM Essentials to resolve revenue recognition issues, noting that current workarounds using customer deposits create liability account limitations.  
* Proposed abandoning custom GL-per-channel configurations in favor of native NetSuite channel segmentation to improve financial reporting accuracy.  
* Noted that manual revenue reclassifications by channel result in inefficient month-end closing processes and loss of transaction-level drill-down visibility.

## **AI-Driven Development Governance**

* Validated 'human in the loop' necessity for AI-generated script deployments to prevent system errors and mitigate liability.  
* Established a 3-phase workflow for AI development: planning, validation, and execution, requiring developer approval for all proposed code.  
* Differentiated between user-controlled suitelet modifications and automated background scripts, with the latter requiring stricter oversight and deployment controls.

## **NetSuite Implementation Methodology**

* Observed that using AI to automate implementation setup is more efficient than conducting traditional, lengthy manual client walkthroughs.  
* Identified that accounting preferences and specific features with circular dependencies remain outside current AI-automated configuration capabilities, necessitating manual intervention.  
* Confirmed AI capabilities to iterate through role permissions by identifying and updating module disparities between source and destination accounts.

## **NetSuite Implementation and Chart of Accounts**

* Chart of accounts loading accomplished after successfully iterating on system account mappings (Taha Raja).  
* Input source identified as a multi-tabbed Excel document requiring standardized mapping for system accounts.  
* Manual intervention required for NetSuite settings including inventory, multi-location, and shipping features (Taha Raja).  
* MCP role permission adjustment successfully enabled subsidiary reading (Taha Raja).  
* Final account structure achieved includes 113 new accounts and 11 renumbered system accounts (Taha Raja).

## **AI and Integration Tooling**

* "Script reader" tool deployed to grant MCP read-only access to file cabinet contents and script deployments (Taha Raja).  
* Playwright functionality evaluated for UI testing, noted as effective for button validation but limited for complex scraping (Taha Raja).  
* Celigo MCP configuration discussed as a potential pathway for integration monitoring (Taha Raja).  
* Feedback loop established to train agents on distinguishing customer-specific logic from reusable best practices (Taha Raja).

## **Executive Reporting and Client Strategy**

* Automated executive summary process implemented to synthesize communication data for enhanced client engagement (Taha Raja).  
* Executive engagement strategy shifts toward consistent meeting cadences to demonstrate ongoing project value (Taha Raja).  
* Shift proposed to replace manual status reporting with AI-generated summaries based on comprehensive data analysis (Taha Raja).  
* Project management focus prioritized increasing consultant visibility into account health and proactively identifying potential issues (Taha Raja).

## **Executive Summary and Asana Data Integrity**

* Standardization of Asana status labels (e.g., 'not started') proposed to improve project reporting accuracy.  
* Project health visibility relies on data accuracy; 's**t in, s**t out' principle identified as a primary reporting bottleneck.  
* Executive summary reports standardized to trailing 2-week hours data to ensure consistent reporting cadence.

## **Project Management and Communications**

* Proposed 30-minute dedicated project management calls to replace hijacking of technical working sessions.  
* Agenda-driven meetings with clear communication of hard stops recommended to maintain continuity.  
* Draft-to-polish workflow suggested to allow manual verification before client distribution.

## **Technical Configurations and AI Skills**

* Managed Service Provider (MSP) references in executive summaries flagged for removal in non-MSP projects.  
* Transitioning project instructions from raw prompts to reusable markdown to ensure skill consistency.  
* API/MCP access confirmed to require full user roles; modifications to employee-center roles restricted by design.

## **Business Growth and Proactive AI Utilization**

* Shift towards proactive consulting identified; leverage AI to analyze dormant accounts for new opportunities.  
* AI data analysis capabilities noted as a driver for business growth and operational efficiency.

## **AI Rollout and Team Enablement**

* Tactical decision confirmed to roll out the Claude platform to all team members.  
* Baseline expectations established for team operations within the new AI-enhanced environment (Taha Raja).  
* Formalization of AI as a required tool for all project work approved (Taha Raja).  
* Guidelines defined for merging personal and team Claude accounts, noting domain-specific constraints (Taha Raja, Mike).

## **Project Collaboration and Knowledge Management**

* Risk flagged regarding reduced team collaboration as individuals potentially operate in silos while using AI (Taha Raja).  
* Standardized folder structures and shared project documentation proposed to maintain context and ensure team visibility (Taha Raja).

## **Strategic Business Evolution and Consulting**

* Service delivery model shift discussed; prioritizing project quality, density, and trust over raw hour-based billing (Taha Raja).  
* Potential to revive dormant accounts identified by proactively offering Model Context Protocol (MCP) setup (Taha Raja).  
* Strategic pivot toward AI-consulting emphasized, necessitating deeper technical understanding and partner-level certifications (Taha Raja).

## **Technical Operations and Resource Optimization**

* Strategic model selection identified as essential for cost and operational optimization (Taha Raja).  
* Acknowledged lack of transparency in AI token management, necessitating manual oversight to manage usage costs (Taha Raja).

## **Next steps**

- [ ] \[The group\] Submit Hours: Submit working hours by the 31st.  
- [ ] \[Michael Flynn\] Forward Documents: Send the documentation regarding the user error to Taha Raja for investigation.  
- [ ] \[The group\] Review Sandbox: Coordinate a sandbox walkthrough with the client to review and validate recent implementation updates.  
- [ ] \[Taha Raja\] Refine SDF: Update the Source Development Framework configuration steps to improve setup efficiency for new accounts.  
- [ ] \[Taha Raja\] Provision Demo Account: Provide access to the next week next demo account for all team members once the request is fulfilled.  
- [ ] \[Michael Flynn\] Assist User: Assist the user with merging their personal account, troubleshooting command line interface issues, and configuring Google Drive access.  
- [ ] \[The group\] Review Functional Area: Conduct a follow up session next week to test AI performance with order to cash or procure to pay processes.  
- [ ] \[Taha Raja\] Configure Celigo Server: Complete the configuration for the Celigo MCP server.  
- [ ] \[Taha Raja\] Synthesize Process: Synthesize discussions from the 3-day sessions to create a process for upcoming development team meetings.  
- [ ] \[Taha Raja\] Share Data: Provide Ashot with the synthesized project process and all relevant raw meeting information.  
- [ ] \[Ashot\] Create Playbook: Update the cloud interface and compile a playbook for SuiteCloud Development Framework and Model Context Protocol setup to prevent deployment roadblocks.  
- [ ] \[The group\] Define Features: Outline the specific features and steps required to successfully enable SuiteCloud Development Framework and install the Model Context Protocol application.  
- [ ] \[The group\] Generate Summaries: Create executive summary reports for assigned client projects using email, Asana, calendar, and hours analysis data.  
- [ ] \[Taha Raja\] Update Skill: Modify the executive summary skill to accurately detect and remove Managed Service Provider references for non-Managed Service Provider projects.  
- [ ] \[The group\] Standardize Task Tags: Establish a consistent method for identifying and classifying project tasks across all team members to ensure uniform data quality.  
- [ ] \[Taha Raja\] Update Status: Apply statuses to projects in Asana to properly distinguish between pending and active work.  
- [ ] \[The group\] Schedule PM Calls: Schedule 30 minute project management sessions separate from standard working meetings to maintain agenda focus and reporting continuity.  
- [ ] \[Taha Raja\] Update Asana: Close the demand planning task in Asana and record the vendor prepayment subtask.  
- [ ] \[Taha Raja\] Update Prompt: Refine the executive summary prompt to serve as reusable project instructions.  
- [ ] \[Taha Raja\] Contact Client: Contact the software consultant during the upcoming Charleston visit.  
- [ ] \[Mike\] Roll Out Claude: Provide access and onboarding instructions for the Claude platform to all team members.  
- [ ] \[The group\] Analyze Project Feedback: Review weekly project recordings and documentation to identify missing information or required improvements.  
- [ ] \[Taha Raja\] Define Folder Structure: Determine the optimal directory arrangement for project source documents and AI analysis files.  
- [ ] \[Mike\] Provision Team: Create accounts and guide team members through the merge process for Claude provisioning.  
- [ ] \[Mike\] Schedule Follow Up: Coordinate a follow up team session on June 12 to synthesize project planning and process definitions.  
- [ ] \[Mike\] Share Partner Portal: Grant all team members access to the partner portal to facilitate required AI training and certifications.  
- [ ] \[Taha Raja\] Log Internal Hours: Specify the correct customer or project code for logging internal hours in the team chat.  
- [ ] \[Taha Raja\] Analyze Project Notes: Process notes from the WMS project for Bomb Party through the AI system to identify actionable insights.  
- [ ] \[Taha Raja\] Revive Dormant Accounts: Contact inactive clients to offer assistance with setting up MCP. Explain the value of this platform to encourage reactivation.

**Want to see more?** [View the full notes]()  
Tip: You can always access your full notes from the left sidebar.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*  
*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=xRqJ1yQXG6JyZxb-EpAIDxIROAIIigIgABgBCA&entryPoint=footerQuickNotes&isGoogler=False) to let us know your feedback, including how helpful the notes were for your needs.*

# **📝 Full notes**

Jul 31, 2026

## **AI Summit**

Invited [Michael Flynn](mailto:mike@powerclouderp.com) [Ron Shaw](mailto:ron@powerclouderp.com) [Justin Lombardi](mailto:justin@powerclouderp.com) [Imran Shabbir](mailto:imran@powerclouderp.com) [Taha Raja](mailto:taha@powerclouderp.com)

Attachments [AI Summit](https://calendar.google.com/calendar/event?eid=NDRpN2VuNm5nY2k0N2NqaGFuZGJpcGhkZnJfMjAyNjA3MzFUMTIwMDAwWiB0YWhhQHBvd2VyY2xvdWRlcnAuY29t)

Meeting records [Transcript](https://docs.google.com/document/d/13iMCfXqqs5gSkTCgG8DHfRA9ylFeo_xGbVABsl3gDbI/edit?usp=drive_web&tab=t.df8419hlufar) [Recording](https://drive.google.com/file/d/1kp1rfUZOJ2k590wd1NN6AM4r4LLyqI9P/view?usp=drive_web) 

### **Summary**

The meeting addressed integrating AI tools into consulting workflows and standardizing project management processes for clients.

**Standardizing AI Implementation Processes**  
The team agreed to implement Advanced Revenue Management Essentials to resolve fragile workarounds. They established structured AI planning processes to ensure system integrity and reduce manual errors.

**Enhancing Executive Reporting Strategy**  
Standardized AI-generated executive summaries will replace manual status reports to provide better actionable value to clients. Dedicated 30-minute meetings will focus these discussions on high-level project status.

**Scaling Consulting Service Delivery**  
The firm will transition toward proactive engagement models by using AI to analyze client data for new opportunities. This shift prioritizes strategic advising over reactive task management.

### **Decisions**

## Aligned

* **Revenue and channel segmentation standard** Revenue accounting is set to utilize a single income account with channel segmentation, aligning with standard practices rather than channel-specific GL accounts.

* **ARM Essentials implementation strategy** ARM Essentials implementation is established as the required recommendation for clients with complex subscription and deposit setups to ensure scalable revenue recognition.

* **AI development governance protocol** AI-assisted code development is limited to a structured process of planning and development team handoff, prohibiting consultants from directly deploying AI-generated changes.

* **Playwright browser tool deferred** The use of Playwright for automated browser interaction is deferred for the current iteration due to reliability and complexity concerns.

* **AI summaries replacing manual reports** Manual weekly consulting reports are replaced by AI-generated executive summaries synthesized from the past two weeks of project data.

* **Bi-monthly executive meeting cadence adopted** Executive meeting cadence is set to a bi-monthly frequency for steady-state projects, with weekly meetings reserved for fast-moving projects.

* **Adoption of Claude Projects for instructions** The team will adopt the use of Claude Projects as the standard method for managing and sharing project-specific instruction sets and prompts.

* **MSP logic updated to project-level** The AI skill instructions will be updated to handle MSP identification via project-level configuration, rather than hard-coding MSP logic into the shared skill.

* **Standardized two-week reporting cadence** Executive summaries will consistently report on the trailing two full weeks of activity, regardless of the specific day of the week the report is generated.

* **Dedicated project management meeting structure** The team will implement 30-minute dedicated project management review calls, scheduled separately from technical working sessions, to ensure agenda focus.

* **Claude rollout to all employees** The organization decided to proceed with a full rollout of Claude to all team members, establishing it as a required operational tool for project work.

* **Mandatory AI education meeting** The team will hold a formal, mandatory meeting on Wednesday the 12th to standardize AI usage expectations and align all staff on the required processes.

* **Team access to AI partner portal** The team agreed to provide all members access to the official AI partner portal to facilitate professional certification and ongoing education requirements.

We've **updated the Decisions section** using your feedback.

Let us know what you think: [Helpful](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?isHelpful=True&entryPoint=decisions&confid=xRqJ1yQXG6JyZxb-EpAIDxIROAIIigIgABgBCA&isGoogler=False) or [Not Helpful](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?isHelpful=False&entryPoint=decisions&confid=xRqJ1yQXG6JyZxb-EpAIDxIROAIIigIgABgBCA&isGoogler=False)

### **Next steps**

- [ ] \[The group\] Submit Hours: Submit working hours by the 31st.

- [ ] \[Michael Flynn\] Forward Documents: Send the documentation regarding the user error to Taha Raja for investigation.

- [ ] \[The group\] Review Sandbox: Coordinate a sandbox walkthrough with the client to review and validate recent implementation updates.

- [ ] \[Taha Raja\] Refine SDF: Update the Source Development Framework configuration steps to improve setup efficiency for new accounts.

- [ ] \[Taha Raja\] Provision Demo Account: Provide access to the next week next demo account for all team members once the request is fulfilled.

- [ ] \[Michael Flynn\] Assist User: Assist the user with merging their personal account, troubleshooting command line interface issues, and configuring Google Drive access.

- [ ] \[The group\] Review Functional Area: Conduct a follow up session next week to test AI performance with order to cash or procure to pay processes.

- [ ] \[Taha Raja\] Configure Celigo Server: Complete the configuration for the Celigo MCP server.

- [ ] \[Taha Raja\] Synthesize Process: Synthesize discussions from the 3-day sessions to create a process for upcoming development team meetings.

- [ ] \[Taha Raja\] Share Data: Provide Ashot with the synthesized project process and all relevant raw meeting information.

- [ ] \[Ashot\] Create Playbook: Update the cloud interface and compile a playbook for SuiteCloud Development Framework and Model Context Protocol setup to prevent deployment roadblocks.

- [ ] \[The group\] Define Features: Outline the specific features and steps required to successfully enable SuiteCloud Development Framework and install the Model Context Protocol application.

- [ ] \[The group\] Generate Summaries: Create executive summary reports for assigned client projects using email, Asana, calendar, and hours analysis data.

- [ ] \[Taha Raja\] Update Skill: Modify the executive summary skill to accurately detect and remove Managed Service Provider references for non-Managed Service Provider projects.

- [ ] \[The group\] Standardize Task Tags: Establish a consistent method for identifying and classifying project tasks across all team members to ensure uniform data quality.

- [ ] \[Taha Raja\] Update Status: Apply statuses to projects in Asana to properly distinguish between pending and active work.

- [ ] \[The group\] Schedule PM Calls: Schedule 30 minute project management sessions separate from standard working meetings to maintain agenda focus and reporting continuity.

- [ ] \[Taha Raja\] Update Asana: Close the demand planning task in Asana and record the vendor prepayment subtask.

- [ ] \[Taha Raja\] Update Prompt: Refine the executive summary prompt to serve as reusable project instructions.

- [ ] \[Taha Raja\] Contact Client: Contact the software consultant during the upcoming Charleston visit.

- [ ] \[Mike\] Roll Out Claude: Provide access and onboarding instructions for the Claude platform to all team members.

- [ ] \[The group\] Analyze Project Feedback: Review weekly project recordings and documentation to identify missing information or required improvements.

- [ ] \[Taha Raja\] Define Folder Structure: Determine the optimal directory arrangement for project source documents and AI analysis files.

- [ ] \[Mike\] Provision Team: Create accounts and guide team members through the merge process for Claude provisioning.

- [ ] \[Mike\] Schedule Follow Up: Coordinate a follow up team session on June 12 to synthesize project planning and process definitions.

- [ ] \[Mike\] Share Partner Portal: Grant all team members access to the partner portal to facilitate required AI training and certifications.

- [ ] \[Taha Raja\] Log Internal Hours: Specify the correct customer or project code for logging internal hours in the team chat.

- [ ] \[Taha Raja\] Analyze Project Notes: Process notes from the WMS project for Bomb Party through the AI system to identify actionable insights.

- [ ] \[Taha Raja\] Revive Dormant Accounts: Contact inactive clients to offer assistance with setting up MCP. Explain the value of this platform to encourage reactivation.

### **Details**

* **Administrative Hours and Documentation**: Michael Flynn and Taha Raja discussed the need to submit hours for the 30th and 31st. They also addressed confusion regarding "Mike's document" concerning how to perform assessments, noting that the document is located in the Atlanta folder and the assessments folder ([00:00:31](#00:00:31)).

* **Access and Usage Issues**: The team identified that a colleague was encountering errors related to file access and document instructions ([00:00:31](#00:00:31)). They confirmed that access to necessary files had not been properly granted and discussed the potential for confusion if a user tries to follow instructions without the correct permissions ([00:01:11](#00:01:11)). Michael Flynn confirmed they had recently kicked off the "44 thing" and reviewed usage levels ([00:01:55](#00:01:55)).

* **Account Usage and Personalization**: Taha Raja and Michael Flynn discussed the usage of organization accounts versus personal accounts when accessing tools like Claude. They clarified that organization tokens are for work-related tasks and must not be used for personal matters. Taha Raja noted the need to be mindful of which account they are currently logged into to avoid billing issues ([00:04:01](#00:04:01)).

* **Team Access and Organization Management**: The participants discussed the status of organization members, including an invitation status for a colleague named Steve. They noted that they are using the paid version of the AI platform and discussed the balance between free and paid accounts, deciding they do not need multiple organization memberships at this time ([00:05:00](#00:05:00)).

* **Revenue Recognition Workarounds**: Michael Flynn and Taha Raja reviewed a task performed by Imran regarding revenue recognition, specifically using a customer deposit and a billing schedule as a workaround. They acknowledged that while this is a technical workaround rather than standard practice, it was a logical solution, though it requires a "human-in-the-loop" approach to manage ([00:06:37](#00:06:37)).

* **Financial Reporting Challenges**: The conversation shifted to the complexities of using customer deposits for revenue recognition, noting that they often default to specific system balance sheet accounts which can cause issues with deferred revenue postings ([00:07:42](#00:07:42)). Taha Raja and Michael Flynn discussed the difficulty of using multiple GL accounts for each channel, which leads to reconciliation challenges at the end of the month ([00:08:35](#00:08:35)). They agreed that utilizing one income account and using channels for segmentation is a better practice than relying on GL accounts to drive specific reports ([00:10:53](#00:10:53)).

* **Recommendation for ARM Essentials**: Regarding the client's current setup, Michael Flynn and Taha Raja concluded that the best consultative recommendation is to implement the Advanced Revenue Management (ARM) Essentials module. They noted that without the proper module, the client's current workaround is fragile and limits visibility, necessitating a shift to native NetSuite functionality to support future scaling ([00:11:39](#00:11:39)).

* **Process Inefficiencies**: The team analyzed the client's current processes, including order fulfillment and cash sales, noting that while the business is functioning, it is labor-intensive and inefficient ([00:14:38](#00:14:38)). They emphasized that their role as consultants is to push for standard NetSuite practices rather than maintaining convoluted, manual workarounds that could break if the system changes ([00:15:40](#00:15:40)).

* **Claude's Performance on Tactical Tasks**: Michael Flynn and Taha Raja reviewed Claude's performance on a specific task regarding price tag printing, where they fed the AI the relevant transcript and Asana task numbers. They reported that the AI successfully identified seven pain points and provided effective code changes, which the team successfully tested and deployed in the sandbox environment ([00:16:35](#00:16:35)).

* **Suitelet Governance and Development**: The participants discussed the level of comfort in allowing consultants to modify Suitelets directly versus involving the development team ([00:19:19](#00:19:19)). They agreed that while they currently control the process, as the AI's capabilities and the team's familiarity grow, they need to establish clear lines regarding what can be executed automatically versus what requires developer oversight to avoid systemic risks ([00:20:17](#00:20:17)).

* **AI Risk Management and Liability**: Michael Flynn emphasized the importance of following a structured process—planning, testing, and execution—due to the potential for significant financial liability if an AI-driven change goes wrong in a client's environment ([00:21:17](#00:21:17)) ([00:22:55](#00:22:55)). They discussed the necessity of "human-in-the-loop" verification, noting that even if the AI is helpful, they cannot take excessive liberties with client data ([00:24:56](#00:24:56)).

* **AI as a Development Force Multiplier**: Taha Raja and Michael Flynn discussed the long-term potential of using AI to accelerate development cycles. They noted that as the team gains confidence in the technology and the AI's ability to handle more complex tasks, development queues might shorten, provided they continue to adhere to strict internal process standards ([00:26:41](#00:26:41)).

* **Standardizing the AI Planning Process**: The team discussed utilizing Claude's built-in planning features, such as the initialization and planning prompts, to create structured use case documents ([00:29:30](#00:29:30)). They agreed that these generated plans, including assumptions and preconditions, serve as critical institutional knowledge that should be documented and delivered to the client ([00:30:40](#00:30:40)) ([00:32:22](#00:32:22)).

* **44 Implementation and SDF Usage**: Michael Flynn and Taha Raja reviewed the implementation of the "44" project, specifically the use of SuiteCloud Development Framework (SDF) to configure a new account. They noted that while some steps, such as enabling features and setting accounting preferences, required manual intervention, the AI successfully handled much of the configuration ([00:36:42](#00:36:42)) ([00:40:15](#00:40:15)).

* **MCP and Role Permissions**: Taha Raja explained the process of installing the NetSuite Implementation (MCP) suite app and role, noting that the system iterated through missing modules and updated the role permissions accordingly ([00:43:14](#00:43:14)). They discussed that while this automation is beneficial, they must always communicate these actions to the client to maintain transparency and ensure they are operating within the scope of their agreements ([00:45:03](#00:45:03)).

* **Evolving the Setup Walkthrough Process**: The team reflected on how the implementation process has evolved, specifically moving away from exhaustive manual walkthroughs of every checkbox in the setup menu, which they described as a "waste of time" ([00:47:45](#00:47:45)). They discussed using AI to pre-configure environments, allowing for more pointed and meaningful walkthroughs that focus on the customer's specific needs rather than general system settings ([00:49:30](#00:49:30)).

* **Colleague Support and Troubleshooting**: Michael Flynn and Taha Raja discussed assisting a colleague with specific technical issues, including merging a personal account, resolving CLI issues, and troubleshooting access to an assessment folder. They planned to assist this colleague to resolve these barriers ([00:53:37](#00:53:37)).

* **Demo Accounts and Future Outlook**: Taha Raja reported on the request for a new NetSuite demo account, noting the challenge of expiration dates and the need to keep these environments active ([00:54:32](#00:54:32)). They briefly touched upon the "NetSuite Next" AI features, expressing skepticism about its current capabilities compared to their internal AI-driven processes, while noting that they intend to maintain a first-mover advantage by continuously refining their methodology ([00:56:27](#00:56:27)).

* **Chart of Accounts Configuration**: Taha Raja initiated the discussion on loading the Chart of Accounts, noting that the input provided was a multi-tabbed Excel document from Ron, rather than a format pre-optimized for NetSuite ([00:59:11](#00:59:11)). The team discussed issues with demo accounts and concluded that they need to refine their instructions to have the AI suggest system account mappings rather than asking the consultant to decide, which caused confusion ([01:00:02](#01:00:02)).

* **Manual System Interventions**: Taha Raja outlined the manual interventions required for system settings that SDF or MCP could not handle, such as inventory, custom records, and permissions. They addressed a blocking issue by adding "list subsidiaries" permission to the MCP role to ensure the system could read subsidiary information ([01:00:57](#01:00:57)).

* **AI Responsibility and Oversight**: The team debated the extent to which MCP should automate tasks like installing SuiteApps. Taha Raja expressed skepticism about total automation, emphasizing that managers must retain ownership and oversight to prevent the team from becoming complacent, as AI cannot take ultimate responsibility for system changes ([01:01:50](#01:01:50)).

* **Playwright and Browser Automation Capabilities**: The discussion covered the use of Playwright for UI navigation. Taha Raja explained that while it allows the AI to interact with UIs and check design implementations, it struggles with inconsistent UI variations and "fuzzy" decision-making, such as scraping vendor sites where data formats change, requiring human judgment that AI currently lacks ([01:03:49](#01:03:49)).

* **Implementation Process Standardization**: Taha Raja reviewed failed automation tasks, such as SuiteFlow and 2FA, and proposed creating a structured "interview" process. This would involve a script that junior personnel or an AI could follow to ensure rapid system setup, although they noted this is intended for complex implementations rather than smaller, lower-cost deals ([01:07:07](#01:07:07)).

* **Chart of Accounts Loading Results**: Taha Raja summarized that the AI successfully processed the Chart of Accounts after iterative rounds of questioning. Despite token limitations, the system created or renamed 126 accounts into a three-level hierarchy. The team agreed that while minor manual edits for specific accounts like "undeposited funds" remain necessary, the results were highly accurate ([01:10:30](#01:10:30)).

* **Feedback Loops and Script Reader**: Taha Raja proposed implementing feedback loops to train the agent on best practices. To address the inability of standard tools to read script code, they introduced "Script Reader," a custom tool that allows MCP to navigate the file cabinet, read text files, and identify inefficiencies in existing customizations ([01:13:48](#01:13:48)).

* **Script Reader Functional Capabilities**: Taha Raja detailed the four read-only skills of the Script Reader: retrieving script source code, listing scripts, reading text files in the file cabinet, and getting script deployment status. These tools significantly enhance the native capabilities of their MCP connection ([01:17:34](#01:17:34)).

* **Future Testing and Integration**: The team discussed future tests, including evaluating matrix item decisions and integrating Celigo connectors. Taha Raja confirmed that they have permission to test MCP within Celigo environments, provided they enable the necessary servers within the Celigo platform ([01:20:07](#01:20:07)).

* **Developing an Integration Monitor**: Taha Raja suggested creating a broader integration monitor within their portal to manage and monitor various systems for clients. They proposed engaging the development team to build a rapid, standardized "playbook" for system setups, such as enabling features and installing MCP, to eliminate manual bottlenecks ([01:23:18](#01:23:18)).

* **Executive Summary Generation**: The team shifted focus to using AI for project management and client communication. Taha Raja proposed utilizing AI to synthesize email, meeting notes, and Asana data into consistent executive summaries, as the current reporting process is insufficient for keeping clients informed of progress ([01:26:56](#01:26:56)).

* **Importance of Executive Meetings**: Taha Raja emphasized that weekly executive meetings are critical for client retention, especially during steady-state phases where clients might otherwise feel they are not receiving value. The objective is to ensure clients feel engaged even when project work is less intensive ([01:31:56](#01:31:56)).

* **Improving Reporting and Identifying Risks**: The team discussed replacing manual consultant status reports with AI-generated executive summaries. Taha Raja noted that this shift would allow them to identify red flags and provide actionable value to the client, rather than delivering reports that simply indicate "all green" statuses without substance ([01:35:57](#01:35:57)).

* **Executing the Executive Summary Process**: Taha Raja instructed team members to test the new executive summary generation process on other clients. This requires connecting inputs like email, calendar, and Asana data, with Taha Raja recommending a bi-weekly frequency for steady-state projects ([01:39:16](#01:39:16)).

* **Enhancing Summary Content**: The team discussed incorporating an "interview" component into the summary generation, where the AI queries the consultant about future steps. This would help reconcile Asana tasks with client needs and surface deferred or "nice-to-have" items that could be addressed during slower project periods ([01:42:33](#01:42:33)).

* **Technical Setup for Summaries**: Taha Raja provided guidance on technical implementation, including using specific prompts and connecting the necessary data sources to the AI. They confirmed that team members should share these prompts to standardize the output ([01:44:55](#01:44:55)).

* **Data Preparation for Testing**: The team reviewed the practical steps for exporting hours data and preparing CSV files for the AI. Taha Raja suggested selecting manufacturing or WMS data sets for the initial testing phase to ensure robust results ([01:48:44](#01:48:44)).

* **Tooling and Communication Strategy**: The participants critiqued Asana, noting that its expense and low client adoption make it a suboptimal communication tool. Taha Raja suggested exploring lighter-weight, email-based ticketing or alternative methods to improve client engagement and reduce friction ([01:52:20](#01:52:20)).

* **Finalizing the Workflow**: Taha Raja concluded by confirming that the executive summary skill is ready for trial. They agreed to manage the workflow by providing the required files to the AI, moving toward a data-driven process that centralizes communication without requiring manual updates from consultants ([01:55:50](#01:55:50)).

* **Employee Center Role Permissions**: Taha Raja and the team discussed the technical limitations of utilizing "Employee Center" roles in Asana for MCP (Multi-Cloud Platform) connectivity ([01:58:51](#01:58:51)). They noted that these roles do not support the necessary permission sets to connect to MCP, and the system design prevents customizing them to include such access, requiring a move to full user roles instead ([02:00:13](#02:00:13)).

* **Personal and Informal Discussions**: The group held informal discussions regarding personal experiences with caffeine and tobacco alternatives, such as "Grinds," as well as personal anecdotes regarding health and habits ([02:01:27](#02:01:27)). Additionally, the participants briefly discussed television streaming services, the quality of various streaming sources, and shared opinions on films directed by Christopher Nolan ([02:35:40](#02:35:40)).

* **Project Health Status Reporting**: The team addressed why project health reports in Asana were appearing as "yellow" or "at risk," attributing this to high task volumes where only a small percentage of tasks were marked complete ([02:10:17](#02:10:17)). They concluded that this is a result of early engagement phases where tasks are loaded but not yet initiated, and agreed on the need to better categorize these tasks to prevent misleading project status indicators ([02:11:08](#02:11:08)) ([02:14:24](#02:14:24)).

* **Asana Task Management**: To improve the accuracy of project tracking, the team discussed implementing a status system for tasks, specifically labeling them as "not started" rather than leaving them blank ([02:15:16](#02:15:16)). They agreed that clearly identifying future-state work items would prevent them from being reported as lagging or neglected work ([02:16:22](#02:16:22)).

* **Standardization of AI Projects and Prompts**: The group moved to formalize their use of AI by creating specific "projects" in their AI tool, which allow for shared instruction sets and consistent prompt usage ([02:18:07](#02:18:07)). They planned to reformat their primary prompts into project-level instructions, enabling them to reuse these standardized formats for weekly executive summaries ([02:19:12](#02:19:12)).

* **AI Usage and Cost Analysis**: Taha Raja noted the need to analyze AI tool usage and associated costs to determine the most cost-effective approach for scaling, whether through increased seat tiers or allowing for overages ([02:24:14](#02:24:14)).

* **Handling MSP and Billing Flags**: The team identified that executive summaries were incorrectly flagging projects with "Managed Services Provider" (MSP) status ([02:28:22](#02:28:22)) ([02:30:14](#02:30:14)). They determined that because MSP requirements vary by client, this logic should be managed through project-level instructions rather than global skill changes to ensure reports accurately reflect individual contract terms ([02:29:20](#02:29:20)).

* **Executive Summary Cadence**: The participants agreed that executive summaries should be based on trailing two-week periods to ensure all hours are accurately logged and captured, regardless of the day of the week the summary is generated or when the client meeting occurs ([02:33:45](#02:33:45)).

* **Workflow for AI-Generated Documentation**: The team established a proposed workflow where AI generates a draft summary, which is then reviewed to update Asana tasks ([02:42:55](#02:42:55)). This ensures that documentation in Asana remains current and reflects actual work performed, rather than just summarizing un-updated tasks ([02:38:47](#02:38:47)) ([02:44:08](#02:44:08)).

* **Implementation of Dedicated Executive Review Meetings**: The group discussed the necessity of scheduling dedicated 30-minute executive meetings, separate from working sessions ([02:46:16](#02:46:16)). This strategy is intended to keep clients focused on high-level project status and prevent meetings from being derailed by technical problems or "rabbit hole" discussions ([02:47:21](#02:47:21)).

* **Meeting Agenda Best Practices**: To ensure continuity and focus, the team emphasized the importance of starting every meeting with a set agenda and a hard stop time, as well as concluding with a recap of agreed-upon tasks to chain meetings together effectively ([02:49:24](#02:49:24)).

* **PowerPoint Presentation Strategy**: The team decided to task their AI tool with generating four to five-slide PowerPoint presentations for executive summaries ([02:50:32](#02:50:32)). They confirmed that the AI should utilize their existing brand guideline files to ensure all presentations adhere to corporate standards ([02:51:24](#02:51:24)).

* **Travel Logistics**: The participants briefly coordinated travel logistics regarding their flights, confirming terminal details and the timing required for airport transit ([02:53:28](#02:53:28)).

* **Proactive Business Growth and Opportunity Discovery**: The team explored the future of their consulting approach, focusing on shifting from reactive to proactive engagement ([02:56:56](#02:56:56)). By using AI to analyze client data, past project histories, and new industry features, they intend to identify and present new opportunities to clients, thereby scaling their business and increasing their value as consultants ([02:55:56](#02:55:56)).

* **AI Roll-out Strategy**: Taha Raja states that the team must proceed with a full rollout of Claude to all members, emphasizing that this initiative is about "opening new doors" rather than just increasing efficiency ([02:58:48](#02:58:48)). The plan involves taking existing project recordings and documentation from the current week and running an analysis on them to identify skill gaps and necessary instructional improvements, which will be housed in a specific subfolder within the assessments directory ([02:59:52](#02:59:52)).

* **Operational Workflow and Education**: Taha Raja emphasizes that relying solely on documentation is insufficient, suggesting that a formal, group-based education session is required to ensure everyone is on the same page regarding project setup and operational readiness ([03:01:04](#03:01:04)).

* **Standardizing AI Expectations**: Taha Raja notes that team members have varying levels of experience with AI, citing a recent session with Maria as an example of how direct, hands-on demonstrations of tools like the Model Context Protocol (MCP) are necessary to baseline expectations for everyone operating in the cloud team environment ([03:02:19](#03:02:19)).

* **Technical Provisioning and Account Management**: Regarding the technical deployment, Taha Raja discusses the need to address "quirks" related to email domains and account merging, noting that individuals may have personal accounts that conflict with power cloud-connected accounts; Mike and Besh are tasked with managing these provisioning details ([03:03:18](#03:03:18)).

* **Collaboration and Silo Prevention**: Taha Raja identifies a significant risk that AI agents may lead to operational silos, where team members feel they can complete tasks independently and subsequently reduce their communication with colleagues ([03:07:25](#03:07:25)). To prevent this, the team must prioritize communication, as failing to share project insights or AI-driven advancements results in knowledge gaps that harm overall project management ([03:08:23](#03:08:23)).

* **Project Knowledge Management**: Taha Raja suggests utilizing a specific folder structure to store project context and AI-generated outputs, ensuring that all team members and AI agents have a unified, documented knowledge base to reference, which maintains continuity even when multiple engineers are working on the same project ([03:09:39](#03:09:39)).

* **Follow-up and Iteration**: Taha Raja outlines the next steps, which include iterating on current processes, documenting observations, and scheduling a virtual meeting to discuss potential improvements before the official launch. The long-term goal is to allow an "agentic engineer" to eventually take over initial passes on project tasks ([03:12:00](#03:12:00)) ([03:18:32](#03:18:32)).

* **Addressing Team Anxiety**: Taha Raja acknowledges the psychological impact of industry-wide changes and the fear of layoffs, noting that these anxieties are normal ([03:13:07](#03:13:07)). To mitigate these fears and prevent misinformation, Taha Raja stresses the importance of transparent, open communication, as ignoring the situation often causes team members to rely on assumptions ([03:14:06](#03:14:06)).

* **Scheduling and Timeline**: The team agrees to prioritize a provisioning meeting for those without Claude access to be held within the next week. A subsequent team-wide meeting is scheduled for Wednesday the 12th to synthesize notes, refine plans, and work through outstanding operational questions ([03:17:36](#03:17:36)).

* **Business Model Transformation**: Taha Raja discusses the shift from traditional time-and-materials billing to AI-assisted workflows, noting that while AI significantly reduces the time required for tasks like rapid assessments, the firm must be prepared for clients who may expect lower costs or are already aware of AI-driven efficiencies ([03:19:32](#03:19:32)).

* **Value Proposition and Quality**: Taha Raja argues that the focus should be on using AI to increase the quality, consistency, and density of information rather than solely focusing on speed. By enhancing these aspects, the firm builds trust and provides a strategic advantage that is valuable to clients, even if it does not immediately reduce the total hours billed ([03:24:08](#03:24:08)).

* **Proactive Client Management**: To address the issue of dormant projects, Taha Raja encourages the team to use AI to perform proactive research on client accounts and suggest new phases or opportunities ([03:25:10](#03:25:10)). This approach helps transition consultants from task-oriented roles to strategic advisors who provide value beyond initial engagements ([03:27:37](#03:27:37)).

* **Professional Development and Certification**: Taha Raja emphasizes that to be an "AI consulting company," team members need to attain AI certifications and gain a deeper understanding of technical backend details, such as data structures and cost models, to better advise clients ([03:29:48](#03:29:48)).

* **Educational Resources**: While Taha Raja plans to provide access to partner-only educational materials, they advise caution regarding third-party AI content creators, suggesting that the team vet these sources as they may often contain outdated information ([03:32:18](#03:32:18)).

* **Cost and Token Optimization**: Taha Raja highlights the necessity of managing AI costs by understanding the differences between models like Sonnet, Opus, and Fable, noting that "AI advisors" must know how to switch models based on task requirements to optimize expenses ([03:35:31](#03:35:31)).

* **Resource Transparency**: The team discusses the "black box" nature of current AI token limits and allocations, acknowledging that while precise usage metrics are not always transparently published by providers, the team must learn to manage these constraints as part of their service delivery ([03:38:17](#03:38:17)).

* **Administrative Hour Logging**: There is ongoing confusion regarding which project or client code is appropriate for logging internal AI development hours, and Taha Raja requests clarification to ensure time is tracked correctly across the team ([03:39:14](#03:39:14)).

* **Closing Remarks and Dormancy Strategy**: In the final discussion, Taha Raja reiterates that a primary strategy for reviving dormant client accounts is to proactively offer the implementation of MCP, as the value proposition of these tools often serves as an effective "eye-opener" for clients ([03:43:37](#03:43:37)).

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=xRqJ1yQXG6JyZxb-EpAIDxIROAIIigIgABgBCA&detailLevel=standard&hasImages=False&entryPoint=footerMain&isGoogler=False) to let us know your feedback, including how helpful the notes were for your needs.*

# **📖 Transcript**

Jul 31, 2026

## **AI Summit \- Transcript**

### **00:00:31** {#00:00:31}

**Michael Flynn:** Friday the

**Taha Raja:** 31st get your hours

**Michael Flynn:** 30\.

**Taha Raja:** in. What is your I don't

**Michael Flynn:** He's getting these errors. I don't know what he said.

**Taha Raja:** know.

**Michael Flynn:** As for Mike's document, which do it?

**Taha Raja:** So there's like how to

**Michael Flynn:** So there's there's like how to perform the assessment

**Taha Raja:** perform it's in the food

**Michael Flynn:** document in the Atlanta thing.

**Taha Raja:** bank. It's also in our assessments folder that we've been working on this week.

**Michael Flynn:** It's also in our assessments folder that we've been working out of this week. So he he's getting this error say to me

**Taha Raja:** So he he's getting to me it's clear what he's asking him to do.

**Michael Flynn:** it's clear what he's asking him to do but I don't know if he's saying I I don't know what to do here.

**Taha Raja:** I don't know. He's saying we don't know what to do here.

**Michael Flynn:** So,

**Taha Raja:** So let me forward this to you and see what he's because to me

### **00:01:11** {#00:01:11}

**Michael Flynn:** let me have access to the he does.

**Taha Raja:** does he have access to the he doesn't have access to that he does did we give

**Michael Flynn:** Does did we get him access?

**Taha Raja:** him access to I have no

**Michael Flynn:** I have no idea.

**Taha Raja:** idea

**Michael Flynn:** Uh, let me look at the license. Yeah, I had not.

**Taha Raja:** yeah I wasn't sure if anything ever

**Michael Flynn:** And I knew I knew we talked about it just before I left on vacation. I wasn't sure if anything ever happened. Yeah. Yeah. If we have not,

**Taha Raja:** happened yeah if we have then he will not have all those right that would be pretty confusing if you try to

**Michael Flynn:** then he will not have access, right? Yeah. Yeah. So that would be pretty confusing if you tried to follow those instructions.

**Taha Raja:** follow

**Michael Flynn:** Yeah.

**Taha Raja:** Uh,

**Michael Flynn:** Uh and I just I just kicked off the

**Taha Raja:** and I just I just kicked off the the 44 thing

### **00:01:55** {#00:01:55}

**Michael Flynn:** the usage.

**Taha Raja:** again. I told you it was I was out of usage.

**Michael Flynn:** Mhm.

**Taha Raja:** Anyway,

**Michael Flynn:** Anyway,

**Taha Raja:** H.

**Michael Flynn:** two

**Taha Raja:** Okay. What are we putting for hours?

**Michael Flynn:** for this. Are we good?

**Taha Raja:** We said like four,

**Michael Flynn:** I know.

**Taha Raja:** four or five, whatever. And then I know yesterday whatever 8 to whatever time we finished. So, you know, if we finished at one or two, whatever.

**Michael Flynn:** I didn't know if you had it wanted it set to like nope five hours a day, whatever, but No, just what whatever time we finish between one and two, right? Most of the day. Okay. And those hours All right. So, couple successes yesterday, a couple bumps in the road to be expected. Um, he said I didn't send him the link to log into CL.

**Taha Raja:** I don't think so. Maybe

**Michael Flynn:** Do you see him in the user list? No mine is booting up organizations just to confirm

### **00:04:01** {#00:04:01}

**Taha Raja:** we are using at least I have access to is company's account. Yes.

**Michael Flynn:** that's tokens

**Taha Raja:** Yeah. I should be mindful of it.

**Michael Flynn:** right.

**Taha Raja:** Of course not. So I should not be using it for personalizations. Well if you if you do we'll charge you for it. You'll see it. We'll just you know take it off your bill. Yeah,

**Michael Flynn:** My mic was very whatever.

**Taha Raja:** because I was asked because I asked Taha has mentioned tokens

**Michael Flynn:** I

**Taha Raja:** like a dozen times. Well, I think I I may have like I don't know if it was a personal thing,

**Michael Flynn:** think.

**Taha Raja:** but it was just like loosely workrelated and I was like, "Wait, s\*\*\*, I'm in the wrong freaking cloud because I was logged into one, not the other." Your fine is in there. So, you must have pending the invite. Everything. Well, you do you have do you want your email or with claude at power? I mean my email, but no because I had there was a shared one before that that he had given me access to my

### **00:05:00** {#00:05:00}

**Michael Flynn:** We had our individual

**Taha Raja:** account

**Michael Flynn:** button.

**Taha Raja:** organization right now and it says user standard right? Yeah. I mean cuz I'm comfortable.

**Michael Flynn:** It's hot.

**Taha Raja:** No, we've not invited Steve, right?

**Michael Flynn:** like

**Taha Raja:** Does it give good?

**Michael Flynn:** random

**Taha Raja:** Did not know that. Oh yeah. Well,

**Michael Flynn:** organization paid version of GP that's yeah

**Taha Raja:** I might even add that too. I don't know. I got to like check because I definitely signed

**Michael Flynn:** feel like you just Yeah.

**Taha Raja:** up

**Michael Flynn:** Yeah. Probably

**Taha Raja:** which is fine. 13

**Michael Flynn:** members, you know. I don't need multiple

**Taha Raja:** paid between a free and

**Michael Flynn:** person.

**Taha Raja:** one or maybe I didn't intend it.

**Michael Flynn:** I figured he would get lost from the shuffle while he was out.

**Taha Raja:** Wait till he was back in the real

**Michael Flynn:** Actually,

**Taha Raja:** world.

**Michael Flynn:** this might be working better where we looked at the

### **00:06:37** {#00:06:37}

**Taha Raja:** Let's

**Michael Flynn:** last night.

**Taha Raja:** review

**Michael Flynn:** So, you here we we talked through Imran's task. I think it didn't come up with the solution that I had in mind. It pushed back on that solution. Understandably so because that's not really the a deposit with a billing schedule is not really meant to be used for revenue recognition but logically we know it can be. I explained how I would intend to use it after it pushed back and said well maybe that's a good idea. Um I don't think there's anything to do there. I think that's just a case where human in the loop is going to be important. human experience and knowledge because that truly is a workaround of some sort. I would not expect a tool to come up with that idea. Which idea was this? I'm sorry. I was going I didn't catch that. So for revenue recognition using a customer deposit and a billing schedule. Oh, the

**Taha Raja:** Oh,

**Michael Flynn:** subscription.

### **00:07:42** {#00:07:42}

**Taha Raja:** as a workaround. Yeah.

**Michael Flynn:** But so with that,

**Taha Raja:** Customer deposit. Here's the challenge.

**Michael Flynn:** I guess we talked about that

**Taha Raja:** Does customer deposit go to a system balance sheet account? So, we

**Michael Flynn:** yesterday too and it's it is it is something you have to talk to the customer about. Do they really need separate deferred revenue and they're both liabilities? It's required by GAP. Well, if you're not using customer deposit for other purposes, you just you could rename it, but they would have it, right? Because a regular probably Well, they're not today. Everything is subscription. No, their regular sales orders are not using deposits. But is that something that we're also recommending? I think we're also going to recommend then what we need to do is pair it up with PowerG. Yeah. Yeah. So, right now the process Oh,

**Taha Raja:** is sales order fulfillment invoice cash sale it's dangerous you have to do not

**Michael Flynn:** there's no invoice.

### **00:08:35** {#00:08:35}

**Michael Flynn:** Sorry. Cash sales customer deposit.

**Taha Raja:** only

**Michael Flynn:** You have to fix the customer the deposit application as well because it's going to try and empty the If we move the deferred revenue postings, if we use this method and deferred revenue postings are landing in the customer deposit account and we use PowerGL to move them, We all also have to find the customer the deposit applications that are part of the same chain and make sure that the money that's moving out of the dep the deposit account is also changed to move out of it gets pretty messy gets messy that's why you want to use revenue that's whying and like that's an example as to you said their other thing that they do is they have GL accounts which this one we know the answer to they have GL accounts for every channel and at the end of the month they reclass their revenue into the right channel. Why? They also have the they have both they have GL account and channels

**Taha Raja:** an Amazon sale 1020 GL account and there's Amazon sale as

### **00:09:38**

**Michael Flynn:** like

**Taha Raja:** why um that's

**Michael Flynn:** sounds like initially something we you should always push

**Taha Raja:** how

**Michael Flynn:** back strongly on if it comes up during implementation. Yeah. um item they all go to Shopify that for them but

**Taha Raja:** theoretically our GL could

**Michael Flynn:** I would not recommend that. I would recommend bringing it more in line with Netswuite's standard practice for the same reason because now you have to worry about returns. You have to worry about the cash sales/invoice. And you know honestly here's the thing they may have done this again I'm just saying they may have done this because there are financial reporting constraints on how you report. But to me driving account

**Taha Raja:** You're

**Michael Flynn:** setup to drive a specific report is not a good practice.

**Taha Raja:** g

**Michael Flynn:** Uh for a specific report you want to say the data is separated properly because then you can report in today's world with the way reporting works it's far easier to make sure the report works correctly but to have GL where you have an account and a class you know people will make mistakes on that.

### **00:10:53** {#00:10:53}

**Michael Flynn:** Well, then you lose some feature functionality. Right now, if you go to look at your income statement and you want to drill down, you're going to end up drilling all the way to a journal entry, not the individual transactions like but okay. So, so we are recommending we we recommend

**Taha Raja:** one income account which was an item record.

**Michael Flynn:** one.

**Taha Raja:** So every income goes to that and then use channels for segmentation.

**Michael Flynn:** My thing is that question for you is in the rapid assessment did you ask

**Taha Raja:** private

**Michael Flynn:** them why they're not using the billing schedule or revenue recognition? Billing schedule or revenue recognition?

**Taha Raja:** education they don't have they don't have the license for living education no I

**Michael Flynn:** They did they consider it? No.

**Taha Raja:** mean

**Michael Flynn:** Was it? They never considered it, never looked at it. No, they were aware of it. uh revenue

**Taha Raja:** as a additional module but I didn't like it was expensive or not it's a revenue recognition arm module for

### **00:11:39** {#00:11:39}

**Michael Flynn:** recogn

**Taha Raja:** just this thing is okay even for us like even for the that's what it's but the arm has now potentials based on what you're talking

**Michael Flynn:** So I don't know they could do with this.

**Taha Raja:** about.

**Michael Flynn:** I'm not sure if they valued

**Taha Raja:** that both. But he mentioned about knowing about it from have built a workar around and

**Michael Flynn:** it.

**Taha Raja:** it's working and they're just using it. But if we move to that and they don't even have deposit, right? So they have a non-inven I don't know if you were there. Yeah. Yeah. Yeah. No inventory. You talked about it. Yeah. And at the end of the month she reclassifies it. She's right. Then you lose the all the visibility of you end up going to a journal entry. Um so if you want to change that we have to change the customer deposit part also. So but the question then end up being is what is the

### **00:12:34**

**Michael Flynn:** recommendation for the customer is the is that is the correct recommendation is

**Taha Raja:** right

**Michael Flynn:** they should get ARM essentials and use native Netswuite functionality to resolve all these issues. I think that as a consultant that's how I would tell them saying the perfect answer is you get ARM essentials and you implement this because that will help you keep it clean and scale out in future as Netswuite continues to evolve. Yeah, I is AR essentials different than the advanced. Yeah, I think that's probably right. I actually think this is complex enough the way that they've set it up that you probably just need a full deep dive setting like No, I know. But at the end of the day though, if they want to undo their current workaround, then the right answer is you must do ARM essentials because otherwise if you have regular trans

**Taha Raja:** actions all that stuff.

**Michael Flynn:** and subscriptions doing with our PowerG G. I don't

**Taha Raja:** our he said but that's the other solution right was also suggesting what he said at the beginning

### **00:13:33**

**Michael Flynn:** know.

**Taha Raja:** uh using billing schedules and um deposit they don't even have deposit right now I know so point about the limit

**Michael Flynn:** limitation to deposit I think takes it off the table unfortunately. Oh, that it has to go to deferred revenue account. Yeah,

**Taha Raja:** which frustrates

**Michael Flynn:** I mean I don't know why that's the only transaction in Netswuite where you can't choose where it lands. But yeah, but even if you did, if the choice is one, it still doesn't work because you have two types of deposit, right? But like almost every other transaction, you can hit the account dropdown and it maybe it limits you to type, but it usually doesn't limit you to a specific account. So the idea that you can't have one deposit landing here and one deposit landing there doesn't make any never made sense to me why they lock it so much. But the thing is, how would you control it that this type of deposit goes to this account versus this account if you have a selection with a drop with a drop down on an account level an account dropdown like so many other fields on the deposit?

### **00:14:38** {#00:14:38}

**Michael Flynn:** Oh, on the deposit itself. Okay, got it. On the transaction. Yeah. Yeah. Yeah. Or Yeah. Yeah. I didn't I thought you were talking about configuration. No, no, no. Yeah. Yeah. Like so many They don't even allow it in the setup. It's a system account. So many other things like Yeah. It's a system. Maybe it maybe it locks you into a specific type of account, but you can almost always choose the account itself. Yeah. So there are two three issues and they all are kind of

**Taha Raja:** of connected and requires more one is the order coming in process which is right now order fulfillment and cash sale whereas I think they should still take the deposit because that matches their actual physical because yeah and that's what's happening because they're taking money before delivery Right. Yes, that's the first part. Then this the second part of it is the subscription model which is another they also remove the non-inventory solution and the third part of it is how the segmentation they have done they have GL account for each channel and a channel also all of these so they must they must also have a reconciliation challenge a little bit

### **00:15:40** {#00:15:40}

**Justin Lombardi:** The cash shall post on the payoff.

**Taha Raja:** because

**Justin Lombardi:** Yeah.

**Taha Raja:** everything eventually so as I said they are running the business things are working. It's just extra efficient. Yeah. You you probably are burning a lot of man hours. Yeah.

**Michael Flynn:** It's not hard and they're

**Taha Raja:** It's just effort and it probably lentons are closing and all kinds of

**Michael Flynn:** using pretty efficiently too because some of the entries

**Taha Raja:** she Yeah,

**Michael Flynn:** they

**Taha Raja:** that's fine. Which is good. But you know the thing is Yeah.

**Michael Flynn:** so I think from a consultative standpoint okay because we are consulting based on

**Taha Raja:** So

**Michael Flynn:** Netswuite standard practice

**Taha Raja:** we should say this is the best practice.

**Michael Flynn:** is

**Taha Raja:** Right. Right. But if they say, "Well, we don't want to do that." Then they say, "What

**Michael Flynn:** we here are some alternative recommendations,

**Taha Raja:** kind

**Michael Flynn:** but they do require a lot of wiring that's going to be manual, so to speak, or custom.

### **00:16:35** {#00:16:35}

**Taha Raja:** is the right word?" And this may break down the road

**Michael Flynn:** Mhm.

**Taha Raja:** if next week changes their system. Yeah. So

**Michael Flynn:** In the context of this conversation. So, we had this conversation with Claude yesterday. It did okay. It brought up some of these things. It missed some others. I think it's reasonable. Human in the loop is is going to be the answer there. Um, we then pivoted to temper where we had a very specific task that was the result of a working session. We loaded the working session recording or or transcript into claude. also referenced the task number from the original rapid assessment rapid assessment/AS asana and on that one it was far more tactical it was like this is not working these five things are not working in the sweet lit oh wow much I mean we gave it there was I

**Taha Raja:** and it it nailed it. Wow.

**Michael Flynn:** think seven pain and they I don't think they were that was the labeling thing that we were doing earlier that was just part I think I was part of it in the first part then you were working on price tag printing.

### **00:17:43**

**Michael Flynn:** Yeah.

**Taha Raja:** Yeah.

**Michael Flynn:** Yeah.

**Taha Raja:** So that there was like it was roughly seven.

**Michael Flynn:** Pain points to that printing

**Taha Raja:** You run a little more detail obviously,

**Michael Flynn:** cube.

**Taha Raja:** but um we just fed it.

**Michael Flynn:** Point is, we didn't have to tell it much, you know.

**Taha Raja:** I said, "Go identify the pain points that were, you know, spoke about in the call. Yeah. Evaluate the scripts. See if you can draw the

**Michael Flynn:** than it did.

**Taha Raja:** line

**Michael Flynn:** Uh, a lot of them were fairly trivial changes. You saw some of the code changes.

**Taha Raja:** like an else that was needed.

**Michael Flynn:** It was great. And we even we even executed on and you deployed it. Yeah. And did it work well in in the sandbox? Did you have a chance to test it? Okay. Yeah, we didn't do all of them, but we did we did Yeah, we did the low hanging fruit like the the reprint recode California shows reprinted.

### **00:18:31**

**Michael Flynn:** Truthfully, I didn't.

**Taha Raja:** that because I need I need I need one that has been printed and I just ask in CL.

**Michael Flynn:** And then we ran into an error that we had to fix the results per

**Taha Raja:** So, uh but the

**Michael Flynn:** page is now not a a deployment change and it automatically refreshes.

**Taha Raja:** it's a drop list in the thing and it

**Michael Flynn:** Oh, nice. um that add and we added

**Taha Raja:** does work. I think that'll help them. Yeah.

**Michael Flynn:** um we took away a filter in the column that they said we don't use this and haven't used this in years. There's no reason to have it on here. And then we added to that they said would help them immensely. One for class and we also made item category and we also made item there's an item filter. We made that a multi select.

**Taha Raja:** Hey,

**Michael Flynn:** Yeah, that was another thing. So they can print you know an item it's a dropown list and then you just add an item.

### **00:19:19** {#00:19:19}

**Michael Flynn:** Well, they use this for very spot printing and they just want to multi select where you could say choose this one and move it over here. Choose this one and move it over here. So, just having that functionality think a success.

**Taha Raja:** So yeah, that that was

**Michael Flynn:** Now, I do think there's a question there of, you know, we're working together in this group today.

**Taha Raja:** Iman

**Michael Flynn:** This is a sweet lit. How comfortably are we just letting people go ahead and alter sweet lits versus pushing this? I think I think the rule of whether a customerf facing consultant does it or

**Taha Raja:** gets involved still remains.

**Michael Flynn:** develop I mean you know the thing is you know um

**Taha Raja:** Yeah. Because

**Michael Flynn:** one thing that our consult US consultant facing people may not understand is still the development implications

**Taha Raja:** backend stuff that might come involved.

**Michael Flynn:** tokenization

**Taha Raja:** So uh at this stage I think at phase

**Michael Flynn:** we would want to control that process okay as this thing develops and changes that may Yeah.

### **00:20:17** {#00:20:17}

**Michael Flynn:** And I think this was one that probably at some point the line like this is not a the thing I kept talking about when we were talking earlier about our where does the line go? Things that run automatically and independently are scarier to me than sweet lits which I pull up the screen I choose what to execute and I exactly execute it. If that bombs out, well, it's that process is broken, but like isolated, but it's not ripping through 10,000 records and doing something. We don't want to Yeah. Yeah. If this was a client I was working on by myself, then I would be bouncing this development that that I happen to have Justin on the team and we happen to be in this AI summit, but I also some of his background. No, no, this is a totally different and again with a sweet lit versus, you know, a script that is. Yeah. Well, I mean, you know, we have an AI agentic engineer now and development team that's getting certified on this stuff. Y, they are far more knowledgeable about AI scripting development next week.

### **00:21:17** {#00:21:17}

**Michael Flynn:** For this one, I mean, I can see exactly what you're saying. Like for this one, I feel like we were able to get all that done,

**Taha Raja:** in a day. Just us first

**Michael Flynn:** which will get faster.

**Taha Raja:** try

**Michael Flynn:** If I have to hand if I have to hand this off to Beves, I also have to do a handoff, wait for them to come back. May not take that much time. Like my point being which I

**Taha Raja:** still do is it is it okay for us to do what we did yesterday?

**Michael Flynn:** can see that it's working, see that it does what we asked and then go,

**Taha Raja:** See

**Michael Flynn:** hey, here's what we've done. Just double check. Double check. It is worth it because one small bet damage Yes. will be a liability of $1 million to my company. And the reason I say that, I'm sorry to say that. No, no, I'm fine with that. But but by doing that, we can get it done and check it,

### **00:22:04**

**Taha Raja:** then say here this is what we've done.

**Michael Flynn:** make sure there's nothing there.

**Taha Raja:** When you say this is what

**Michael Flynn:** done. Can you meaning like this is what we've this is what this these are the issues these this these are the changes that we've made all

**Taha Raja:** we

**Michael Flynn:** the code is in this sweet lit check

**Taha Raja:** make sure there's no like big gaps,

**Michael Flynn:** it yes you pushed it into

**Taha Raja:** right?

**Michael Flynn:** sandbox and now you guys go into sandbox and check what we've done not not in the sandbox but

**Taha Raja:** Thanks.

**Michael Flynn:** here's the code that was changed just make sure there's nothing there before you push to sandbox I guess that's a question when should the handle to me to

**Taha Raja:** So, this is what I'm trying to I'm

**Michael Flynn:** me uh very fine line

**Taha Raja:** going to draw

**Michael Flynn:** because let me tell you guys I've been in the business world long enough to know in fact we're going through this in a fire incident which is nothing it takes me

### **00:22:55** {#00:22:55}

**Taha Raja:** I would rather not with due respect.

**Michael Flynn:** out your time than to

**Taha Raja:** I would rather burn three four hours

**Michael Flynn:** even have a single incident happen in five years because that one single incident will pay

**Taha Raja:** of

**Michael Flynn:** for 10 years of your time. But but is it to my company is and that is just that's just a cautionary statement because we live in a full liability world. That is the biggest problem today. Totally agree. But isn't that the purpose of the sandbox? No, I understand that. But remember it's not my sandbox. it is their sandbox and

**Taha Raja:** believe the company sandbox things going on in

**Michael Flynn:** us right and so I don't know you know this is this is where we have to be take steps at a time and again I'm I'm

**Taha Raja:** Everybody.

**Michael Flynn:** I'm open to this thing being proven over time yeah but I'm not going to jump to the end zone without going through the steps y so because the thing is that's we have an AI agentic engineer I would argue that even after this exercise we barely know what AI I can and cannot do.

### **00:23:56**

**Michael Flynn:** We're still starting this journey. So we want to get people right people involved in our teams you know to be there is a certain number of things that we will allow CL consultants to do but remember guys your role is not the development your role is a strategic

**Taha Raja:** and allow that.

**Michael Flynn:** designer do

**Taha Raja:** I know it's kind of fun to say, "Hey, Claude, just

**Michael Flynn:** it but coming up with a concept and handing that

**Taha Raja:** go

**Michael Flynn:** over you've already designed and maybe even planned it

**Taha Raja:** to if you have a portal and you

**Michael Flynn:** out and say to development, hey, go take this and prove it, push it so we can test it and and maybe that's even something we build in, right? Like cloud is our portal powered by cloud underneath has made this suggestion of this

**Taha Raja:** What the change should

**Michael Flynn:** is right there's like a send to development for approval button. Yes. And then when they approve it, then it just executes it and pushes it. But they and they do their own internal testing.

### **00:24:56** {#00:24:56}

**Michael Flynn:** they have their own internal steps to say here's how we validate all these things but maybe we make the turnover easier. Yeah, I think that that's definitely going to help and it obviously won't be there day one but I think that that does help. Well yeah and we have to simulate that process because the thing is yes you know when we dealing with client data I'm extremely cautious liberties

**Taha Raja:** just we we cannot take it

**Michael Flynn:** with because we don't know everything about their environment we never this.

**Taha Raja:** even after clients will come up and say, "Oh,

**Michael Flynn:** You know what I'm saying?

**Taha Raja:** what about see

**Michael Flynn:** And it's like, okay, well, I did not know that. Yeah. No, I mean,

**Taha Raja:** you see instances in the news

**Michael Flynn:** you I can't remember what that one was few months ago where, you know, some guy made a mistake and and uh I can't remember whether it was accounts were disappearing for all these people. It was like literally in the news. Didn't you tell me somebody somebody was telling me that they were messing with plot and it basically deleted all their its data?

### **00:25:53**

**Michael Flynn:** Said that said that. Yeah. or somebody. Well, then I mean you got the worst one where open eye AI recently just lost control of their frontier

**Taha Raja:** escaped and attacked a competitor.

**Michael Flynn:** model.

**Taha Raja:** Yeah, I I had one as the frontier

**Michael Flynn:** I had one situ I didn't have my situation happen that

**Taha Raja:** one,

**Michael Flynn:** bad

**Taha Raja:** but I had one thing that I was doing and it made an assumption and started doing three things.

**Michael Flynn:** to my Chase bank account.

**Taha Raja:** I had to stop it. Yeah. because I was building a reconciliation tool across my all my

**Michael Flynn:** to be able to reconcile to a financial consolidated financial statement.

**Taha Raja:** companies.

**Michael Flynn:** I said, "Okay, go touch this. I have a plaid account, development plat account." It started doing I was like, "No, no, no,

**Taha Raja:** You're not doing any of

**Michael Flynn:** no.

**Taha Raja:** that.

**Michael Flynn:** Maybe you need to pull the statement down somewhere else." your bank

**Taha Raja:** Well,

### **00:26:41** {#00:26:41}

**Michael Flynn:** account

**Taha Raja:** I gave it plaid access to allow to authorize to get the data. Yeah. So, I'll just add one more thought on

**Michael Flynn:** this whole subject and I know it's something that's already it it I remember it even being brought up on the you know the love boat cruise was was that uh obviously development is using AI as well. And one of the benefits long term I believe that's foreseen for this is that their ability to do more and more quickly and so that these these time frames of submitting to development if we go through all of our you know correct steps is not well now we're in the queue and they won't be able to get to that for a week or whatever that that that compresses as well because that's part of this too is uh and we're seeing it right now with Foundry and part of that is I wouldn't say misbehavior on the customer side they just have so many different things.

**Taha Raja:** things they want to do that like the dev cycle on Foundry. Great.

### **00:27:35**

**Michael Flynn:** It's like it's like a you know a car crash on West Park tollway. It's just all backed up. They're going, "Can we get an update on this? An update on this?" And you're going, "Yeah, we can get updates, but man, it would really help if you'd stop putting f\*\*\*\*\*\* cars on the on the tollway." Yeah. Until we get through some of these things. And there's um so anyway, just as a side note, because that's that's part of it, too. But it changes nothing than our responsibility to follow process. Yeah. And and uh and then we see how this evolves over time. And unfortunately, we had a little bit of bad luck where we made a hire to improve bandwidth over there and then within a week we had to move on with Shabbir. So yeah, um bandwidth hopefully should be a little bit better because Shabbir was more on the product side and capital on the other side. But what happened?

**Taha Raja:** Quick. Okay.

**Michael Flynn:** He said he can't continue to work.

### **00:28:37**

**Michael Flynn:** Yeah, I think um taking on

**Taha Raja:** As example what Justin and you guys did.

**Michael Flynn:** just

**Taha Raja:** And what Taha is saying where where is the line drawn? I'm just to get an actual use case. He he he updated his sweet yesterday or built a sweet no sweet was there. You updated few fields. Yep. I think I would

**Michael Flynn:** I would have paused before we actually started writing the code,

**Taha Raja:** have

**Michael Flynn:** told Claude to write up a detailed plan and handed that off to development and let them take all of that. Yeah. Like no for now no writing code. I mean he's not writing

**Taha Raja:** God is writing report.

**Michael Flynn:** any

**Taha Raja:** No, but don't release don't release. There's

**Michael Flynn:** there's three phases,

**Taha Raja:** plan

**Michael Flynn:** right? plan, execute. Oh, plan testing thing or something and then execute. Right? Those are three stages

**Taha Raja:** development that you can have cloud go through.

**Michael Flynn:** of

### **00:29:30** {#00:29:30}

**Taha Raja:** I use GSD. So it it has a very distinct phase process uh uh which is

**Michael Flynn:** a skill, if you will,

**Taha Raja:** a I think there's now

**Michael Flynn:** or uh for for how Claude writes

**Taha Raja:** built-in planning right as well.

**Michael Flynn:** things.

**Taha Raja:** So you know like you can say forward slashinitialization right for clawed code then you can say slash plan and it it'll plan the whole process out which essentially if you think about it plan if you Give it the right prompt the plan will it'll create will be your use case document right I mean would you

**Michael Flynn:** You would you agree on that? Essentially,

**Taha Raja:** would

**Michael Flynn:** no, but I mean that's the content for it. content. The way cloud works is that if you initialize and then if you

**Taha Raja:** the plan ends up being your use case document because it'll put assumptions it'll ask questions and then

**Michael Flynn:** plan

**Taha Raja:** you could probably tell it turn it into a document

**Michael Flynn:** okay so the prompt ends up being whatever your input is like your transcript that you put together or or uh the prompt or the meeting notes whatever.

### **00:30:40** {#00:30:40}

**Taha Raja:** It's funny you said because I I've actually gone and it does make sense by the way. Yeah. But a use case,

**Michael Flynn:** actually gone the other way where it's like I'll still do and

**Taha Raja:** a traditional use case,

**Michael Flynn:** that's my starting point with the prompt. I might I

**Taha Raja:** sorry, that's not my starting point, but I'll have a prompt and the use case.

**Michael Flynn:** might

**Taha Raja:** Well, that and then when I go through that and and I'll do the plan that the implementation plan is what comes out of it. To me, that's the more technical thing. Right. Now, I would say giving both of those to the de dev team or maybe not even maybe just give them the implementation plan. Whatever you want, if you want to call that the use case, fine. Yeah. Yeah. I mean, you know, I think I think use but you know, keep in mind you would do use case to get approval from the client. The process to get approval from the client doesn't go away.

### **00:31:27**

**Taha Raja:** Yeah. Right.

**Michael Flynn:** Right? Because remember you have to seek approval from the

**Taha Raja:** Saying here's what we talked about. Here's what we we want to automate and the more important part here's the assumptions of this

**Michael Flynn:** class.

**Taha Raja:** development. The assumptions I know a lot of people don't pay a lot of attention to but the assumptions are extremely important because there are conditions that you out or said that you have to do this that and the other

**Michael Flynn:** You have been talked about

**Taha Raja:** in order for this to work or this is going to be the assumption of how this script will work based on preconditions that will exist and

**Michael Flynn:** for input into the script.

**Taha Raja:** if those input are not there the script won't work.

**Michael Flynn:** The very things that you complained about in retrofit, well,

**Taha Raja:** and do the checkboxes.

**Michael Flynn:** they didn't do this setting or didn't

**Taha Raja:** Those can be the assumptions in a use case saying in order for this script to work you must have checked this checkbox or you must have done these.

### **00:32:22** {#00:32:22}

**Taha Raja:** Right? So the assumptions are extremely important. I know many people and then they

**Michael Flynn:** lose their side on assumption customer complaints.

**Taha Raja:** when documented

**Michael Flynn:** Well, this is not working. Well, we trained you on it. No, trained you.

**Taha Raja:** it right.

**Michael Flynn:** And we talked about um templins yesterday and

**Taha Raja:** So we

**Michael Flynn:** how a lot of this internal knowledge is lost to time. We can't control if these people keep the document and maintain it, but we can at least do the right thing up front. So, in theory, that document can be passed on from person to person from time to time. Yeah. Yeah. I've even suggested that we start a task. times I've shut the customer down for my

**Taha Raja:** simply highlighting the assumptions and setting them back

**Michael Flynn:** simp.

**Taha Raja:** to you shut them up. Well, that's again this

**Michael Flynn:** The idea of like things like build low health and handover documents is that you now have institutional knowledge that that isn't lost.

### **00:33:22**

**Taha Raja:** when you move on.

**Michael Flynn:** It's not our responsibility if they don't read it. It's not our responsibility if they don't keep it

**Taha Raja:** It is your responsibility to make sure you have it well documented and you delivered it and that's your job and as a

**Michael Flynn:** for us. And then if they don't it or they don't keep it,

**Taha Raja:** differentiator

**Michael Flynn:** you can remind them of it. Mhm. Yeah. I mean, I've worked with I've been talking about for a while like about coming up with some sort of table of contents or something for our solutions that the the documents just get stored on the script record or something like that. Yeah. Yeah. Which I think could be helpful. Anyways, big picture, I see this line moving as we gain confidence in in not only the technology but in our process. I do think there's a day where this non nonrealtime script that's running is something that we can push into it. Um I know we've worked with Justin a little already in trying to find some lowerhanging fruit that you know he could be like the test case on us of pushing some of this stuff in. But as a general rule now this is still going to go through the Yeah.

### **00:34:40**

**Michael Flynn:** I you know what I do here you know with the

**Taha Raja:** Envision a time maybe within constantly

**Michael Flynn:** way things are going where all our developers are just

**Taha Raja:** enhancing our agentic development platform.

**Michael Flynn:** for that's all they're doing you guys

**Taha Raja:** All the front end platform is doing the work.

**Michael Flynn:** are platform's doing the work yeah right but that is coming I

**Taha Raja:** I assure you, but we have to take those baby steps first and I do see that. But remember guys that and

**Michael Flynn:** Your job is about to get hard is because most of

**Taha Raja:** harder and that the way it is not McKenzie level strategic

**Michael Flynn:** us

**Taha Raja:** thinkers in front of the client. We think very tactically able to foresee 10 steps down and

**Michael Flynn:** okay Thank

**Taha Raja:** advise the consultant and client about that.

**Michael Flynn:** you.

**Taha Raja:** being able to say, "Okay, well, if you do these four things, this is what will happen." And advising it and documenting it and communicating effectively with the client to bring that client to your trainer.

### **00:35:43**

**Michael Flynn:** This is

**Taha Raja:** McKenzie charges $1,000 an hour.

**Michael Flynn:** what

**Taha Raja:** They do that level of consulting and you have to elevate yourself to that level. That is the next opportunity. That's the 10 door,

**Michael Flynn:** I'm talking about.

**Taha Raja:** right? We constantly. I've seen consultants do it over and over again where when a client tells them a problem, they immediately tactically jump to a solution

**Michael Flynn:** without asking 20 other questions and why are you doing this?

**Taha Raja:** with is this for and what's the long-term

**Michael Flynn:** What is

**Taha Raja:** implication of doing this.

**Michael Flynn:** So, all right. So, that's the second. So, that one worked pretty well. I I think it as much as that was like a big process for us traditionally, I think those of us who have been working with AI kind of knew it would do that pretty well. Um, but it worked for it worked well. Um, we're actually going to have the customer review the changes in sandbox and see what they think of them.

### **00:36:42** {#00:36:42}

**Michael Flynn:** Um, really happy with the way that works. We then moved on to 44 where we loaded only the calls that occurred before we began implementation. So pre-sales and discovery, we loaded those calls into the source folder. We asked it to make an implementation plan for us and then we did a few things. We had it we had it determine what was possible from a setup standpoint. And I think there were a couple of things we had to do manually which is expected and but we pushed the envelope. We told it to really work hard to see what it could do itself. And give me remind me where we left what how that went. So I

**Taha Raja:** Point being,

**Michael Flynn:** mean

**Taha Raja:** this is for starting with a blank account, right? We're trying to get Claude to do

**Michael Flynn:** much of the implementation as possible.

**Taha Raja:** as you can't connect

**Michael Flynn:** There were a few steps obviously so

**Taha Raja:** SDF to a blank account unless you enable some features just to get

### **00:37:45**

**Michael Flynn:** we can't just say from scratch you got to do certain steps

**Taha Raja:** to the point

**Michael Flynn:** to it there was like literally five settings

**Taha Raja:** where

**Michael Flynn:** yeah token based off blah blah blah um so basic and we could outline what those

**Taha Raja:** All right. I think we'll have to refine that.

**Michael Flynn:** are you different that's all part of it but

**Taha Raja:** Is that doable through the XML thing

**Michael Flynn:** no like the XML the XML is pushed in SCF So you have to turn on the ability to write sweet script and stuff like that.

**Taha Raja:** So, and then there was a couple features where All right.

**Michael Flynn:** Yes.

**Taha Raja:** So, so those settings had to be set up. Then I think we were able to get SDF config wired in. But that doesn't take long, right? I mean, that's Well, it took us a it took us some pushing. That's why because we were pushing against it. Oh, okay. No, but I'm saying as a few

**Michael Flynn:** If you were to say that this would be just an open set.

### **00:38:35**

**Michael Flynn:** Okay. No, now that's what I was saying yesterday. Now I think we could do a lot of these things that we did in between eight and 11, right? Maybe, maybe even faster. Who knows? Uh to it takes the

**Taha Raja:** the clock some time to do some stuff,

**Michael Flynn:** the Yeah.

**Taha Raja:** but point being it can be short

**Michael Flynn:** Yeah. Um because again we didn't know what we would have to do manually.

**Taha Raja:** and we pushed it to try to see what The cut. that down. So I think

**Michael Flynn:** SDF installed. Uh I think the next one was we pushed in. So when SDF is installed and then you enable features is the enable

**Taha Raja:** we

**Michael Flynn:** features done with the input of the nodes to say these are the features I'm going to turn on and does it clog do that? So there there's a base set of features that we need to manually turn on and then there's a secondary step where yes it looked at the recordings and said these are the features we're going to need.

### **00:39:28**

**Michael Flynn:** I'm going to turn them on. And with that, there was some I think multilocation inventory, etc. There was a there's some features where you run into that if you turn it on, you have to

**Taha Raja:** other features it couldn't do because there's circular references to them.

**Michael Flynn:** do

**Taha Raja:** Uh so he basically said I can enable these you'll have to enable these three those be

**Michael Flynn:** but it documents it for you. Could the first step or what do you always have to take?

**Taha Raja:** done.

**Michael Flynn:** Yeah, if you know them. Yes. Yeah, you can. a lot. I think it's Yeah, it might be a two to three steps because Claude will tell you that I'm not I'm able to do this, but here's five you need to do yourself. Yeah. Then there's also there's also certain features like supply allocation where it has to do a data check. Even if there's no data, it has to do a data check. Yep. Before you can then But is that a blocker for clock?

### **00:40:15** {#00:40:15}

**Michael Flynn:** It wasn't. We didn't turn it on. So Oh, no. I don't know. That would be one because honestly for anybody new in my opinion that should be turned on, but yeah. Um so yeah so so that was the enable

**Taha Raja:** is uh I think that that was about the gist of it there. We got to the point where we it could it could enable some we had to enable a couple of them.

**Michael Flynn:** feature.

**Taha Raja:** Uh I think I then moved on to the MCP. Uh did you go preferences yesterday? Yeah, there was some accounting preferences that need to be change that you that it doesn't. So, it does not have access to any of the accounting preferences. Really? No,

**Michael Flynn:** Um,

**Taha Raja:** that makes sense.

**Michael Flynn:** so those have to be done manually. I forget if I did those. Does it tell you or wait but why does

**Taha Raja:** Okay. All of this told us makes sense.

### **00:41:01**

**Taha Raja:** Well, it's probably because it changes the black box on the back end, the accounting blackbox I call it, and probably they've not opened it up for that. Open it up yet. Yes. Yes. So to be fair, I don't

**Michael Flynn:** US cla um I don't remember if that came back from MCP or

**Taha Raja:** remember

**Michael Flynn:** SDF both either way it told us that we had to do it I can they can look into it further but Oh

**Taha Raja:** because you know accounting preferences can dramatically change how your books are recorded and it metric

**Michael Flynn:** yeah.

**Taha Raja:** probably does not want to give access to that automatically. just you they want probably some way to make sure that it's some layer of protection.

**Michael Flynn:** there wasn't any information issue like for I mean you know

**Taha Raja:** I can approval reporting

**Michael Flynn:** there's

**Taha Raja:** those are accounting preferences and that's a dramatic shift. If you're a turn that s\*\*\*

**Michael Flynn:** above $2 million you can't even do cashbased reporting and if Tell me.

### **00:41:58**

**Taha Raja:** on and nobody realized Yeah, the financials are going to be like

**Michael Flynn:** you know, so I mean that that kind of stuff,

**Taha Raja:** off

**Michael Flynn:** you know, can can trip stuff off in a big company. So I'm asking it now. Hold. I mean, that's my guess based on the fact that it's blocked.

**Taha Raja:** what you can doc's and it's permission and that's you're not going to give accountiance

**Michael Flynn:** That's a good point. If MCP does

**Taha Raja:** Manual

**Michael Flynn:** anything,

**Taha Raja:** inter

**Michael Flynn:** I just I just told I said give me an overview of what we have done this able to do on the SDF. s\*\*\*.

**Taha Raja:** it missed some of me and took you uh what you could do via MCP and also what took manual intervention. Yeah, but you know and again these are my guess

**Michael Flynn:** So, okay. So then I had

**Taha Raja:** go uh install the bundle with the MCP roll,

**Michael Flynn:** a

**Taha Raja:** right? Mike shared the bundle. We install install the MCP roll.

### **00:43:14** {#00:43:14}

**Taha Raja:** Well, first of all, there's the sweet app. Oh, yes. Sweet app. You could you MCP is still a sweet app as right. So I had to install the sweet app, install the roll and then create the integration. Install the no.

**Michael Flynn:** Roll to the screen

**Taha Raja:** So we did it just for yesterday as a bundle.

**Michael Flynn:** reader

**Taha Raja:** Um I think we could probably put the role into this world.

**Michael Flynn:** working folder that we're running CL out of and have

**Taha Raja:** I was I put the role in via SDF in the script reader. Right. It's in

**Michael Flynn:** the script radio package. It was interesting when I was installing it for the the

**Taha Raja:** for on ability.

**Michael Flynn:** script

**Taha Raja:** So our role has

**Michael Flynn:** permissions. It says yeah the destination company did not have certain modules.

**Taha Raja:** 221

**Michael Flynn:** So those permissions didn't even exist. So what it did was it iterated, found the differences and updated the role to their needs.

### **00:44:17**

**Michael Flynn:** That's which is really they

**Taha Raja:** awesome cuz I saw it do it. I was said except first when it gave me Oh okay.

**Michael Flynn:** saying these permissions do not exist here.

**Taha Raja:** Okay.

**Michael Flynn:** I was like origin

**Taha Raja:** And then it kept on going and said, "Well, it doesn't because the Wow."

**Michael Flynn:** had these modules and the destination does

**Taha Raja:** Yeah.

**Michael Flynn:** not install the role to

**Taha Raja:** So, to be fair, I I did in

**Michael Flynn:** temper via SDF because of the script reader. So that that I know works and again the

**Taha Raja:** the works. The script reader wasn't installed in in 44 yet or the demo 44\. So, I mean, the script reader should probably just be in the package that we have here and it should be part of it. It should just know to install that automatically.

**Michael Flynn:** I don't see why not actually if that's Would we ever not want it to have that capability?

**Taha Raja:** Yeah. Like why wouldn't why would

**Michael Flynn:** I I agree.

### **00:45:03** {#00:45:03}

**Michael Flynn:** I think because it's a read only thing anyway, right? So I I think I think it would be I mean obviously permission from the client

**Taha Raja:** you have to get if you explain to them that

**Michael Flynn:** you're doing this but this is a read

**Taha Raja:** hey capability it'll allow

**Michael Flynn:** only because eventually there's going to be some scripts in there on the

**Taha Raja:** us

**Michael Flynn:** permission. Is there any merit in

**Taha Raja:** including language about that about our our methodology and our approach and that we're going to do this in the initial steps of the engagement. So, we don't even have to I don't have to ask them, hey, can I do this? They already agreed to So we're in a cut over period now where people are

**Michael Flynn:** old agreements, but yes, new we we have this what's called the master services agreement that everybody signs with us. But I will tell you to be thorough, when you do install anything in the client's computer, even though they've already signed off, you need to inform them that you're doing

### **00:45:56**

**Taha Raja:** that that's fine. And I guess my point was and they have the option to say no at that time.

**Michael Flynn:** this.

**Taha Raja:** Yeah. Here's what you know, okay, I'm going to jump in there. Well, see the thing is like sometimes like you just said, you you can install MCP and do some investigation in their system before you have a kickoff call.

**Michael Flynn:** No, but that's where we miss at that point. When you give do the MCP installation, we are asking them we're going to do this. That's before the kickoff call. Sales has

**Taha Raja:** done that and we introduce you through email and we're asking you through email to ask that's that's exactly what I want

**Michael Flynn:** already

**Taha Raja:** to yes when we introduce when we introduce you your

**Michael Flynn:** happened will be to say,

**Taha Raja:** role

**Michael Flynn:** "Hey, Mr. Customer, we need access. So this time we're going to be doing MCP blah blah blah.

**Taha Raja:** I need an

**Michael Flynn:** introduced it just fires off.

**Taha Raja:** email

**Michael Flynn:** Yeah.

### **00:46:49**

**Michael Flynn:** Yeah. And that's fair. Um but you're right because we

**Taha Raja:** access at that point. So that's one to ask. Yeah, guys,

**Michael Flynn:** do.

**Taha Raja:** I will tell you just like we would have done even without AI, right? Anything you do that is of consequence in their system, yes, you will have you will have approval,

**Michael Flynn:** I mean that's just the way it should go.

**Taha Raja:** right?

**Michael Flynn:** Well, I was only asking just to see the just to have the phone.

**Taha Raja:** Yeah. Nailed down. Um so in this case of like the previous example was the sweet making a customization deploying a customization this is a brand new implementation enabling features configuring some preferences is that something development does we do handover agent AI so who did it before we thought

**Michael Flynn:** Yes. Yeah. You

**Taha Raja:** the thing is this is this is your part of it I I have gone through an evolution in the setup process.

**Michael Flynn:** see

**Taha Raja:** Right? Before long time ago, I used to

### **00:47:45** {#00:47:45}

**Michael Flynn:** have sessions with the client to enable features.

**Taha Raja:** actually

**Michael Flynn:** And what I found

**Taha Raja:** remember I had one with Ry. It was like a threeh hour three Ray Khan remember? Oh yeah. Or what was it? Yeah. Yeah. I went. went through each and every setting and explained to customer. I had to read myself through like each and every checkbox in the entire enable five tabs and I used to do something I used to do something similar. It was standard process. Yeah, it I used to do something similar before but I've I've come to the conclusion that that is a complete waste of time. But the customer doesn't really know

**Michael Flynn:** And it ends up actually opening Pandora's box of questions that honestly there's no answer. The whole enable features in the setup thing. You can see it. I can tell it's a complete waste of time in my opinion. Eyes are glass over. I mean, yeah, you're building.

### **00:48:38**

**Michael Flynn:** Well, and then the other thing is you give them an explanation of something and they usually answer, "Well, I may use it." That's

**Taha Raja:** It's like what what do you mean by I may use it? What does that mean? Right?

**Michael Flynn:** exactly

**Taha Raja:** And and the thing is the customer is just hedging, right? That's all they're doing because they don't know. We don't know if you miss it. It's easy when you're doing a walk through if the

**Michael Flynn:** comes up and it's not turned on,

**Taha Raja:** issue to

**Michael Flynn:** you just go turn off. Yeah.

**Taha Raja:** me that's that that's more beneficial to the customer because they see where the failure point is and they go oh and you you're telling them oh yeah this isn't this feature is not on here's how you go do it and now they've felt the pain or or seen the pain and know what the solution is it means more to them well and and you know the thing is you know doing walkthroughs and all that all process may change like you may have AI prepare order the cache walkth through for you right

### **00:49:30** {#00:49:30}

**Michael Flynn:** So that some sample transactions are staged properly and

**Taha Raja:** so everything is preconfigured with their

**Michael Flynn:** everything.

**Taha Raja:** fields the PDFs everything right you may have done all of that work so that when you prepare I think

**Michael Flynn:** The walkth through it is very pointed to the customer's needs.

**Taha Raja:** we're evol

**Michael Flynn:** Something where the pendulum can swing one way or the other, right? The old way that we were doing was

**Taha Raja:** was blank and then you went through a bunch of different walkthroughs with inputs and

**Michael Flynn:** everything.

**Taha Raja:** then you refined and iterated but that's because you were manually doing this stuff like fields, forms, adjustments, PDFs and that we continue to do it because we we did it. Yeah. But now I think you can you can blend a little bit of

**Michael Flynn:** Okay, you have the notes. You have a good understanding.

**Taha Raja:** hopefully of what they need. You let AI make the setup of order to cash of

**Michael Flynn:** First it of a

**Taha Raja:** what you've envisioned it to be looking like based on what you know about their business, right?

### **00:50:36**

**Taha Raja:** And again,

**Michael Flynn:** youerate against that but then the maybe

**Taha Raja:** it's a lot more targeted and meaningful.

**Michael Flynn:** become rights and the the the

**Taha Raja:** outputs may

**Michael Flynn:** the may pointed it PDFs.

**Taha Raja:** look more pointed. So now you're you're walking through them and that first walk walk through.

**Michael Flynn:** is already three walkthroughs.

**Taha Raja:** Then in that meeting, obviously they're giving you feedback this and you may do that

**Michael Flynn:** and all that feed back to and say refine

**Taha Raja:** two or three times at most before you say we're shut down on order to

**Michael Flynn:** for example, right?

**Taha Raja:** cash.

**Michael Flynn:** But now about took six to seven weeks can be some hours now.

**Taha Raja:** start to be honest to be honest it may even change even further where you know think about it if Netswuite is doing pre-sales calls when they're selling light all the blueprint work and all that

**Michael Flynn:** right and AI is

**Taha Raja:** detailed

**Michael Flynn:** native to Netswuite. What's to prevent them to feed that data so that be

### **00:51:54**

**Taha Raja:** before they even provision the account or when they provision the account, it's already set up for the client exactly the way they want it. Yeah, that's what I was as a starting point. Yeah. So that's oh that's that's going to happen.

**Michael Flynn:** So ends up being okay.

**Taha Raja:** So now your role finding it further,

**Michael Flynn:** Taking that and

**Taha Raja:** right? Yeah. Basically we don't work with those these are starter customers,

**Michael Flynn:** ref

**Taha Raja:** right? They don't get anything customized no integration nothing just out of the box roles forms features data migration is the biggest holdup and I mean these are the implementation which net even does free towards end of quarter and end of the year just to get the customer on board that's how simple it is they won't even create a single custom field for you yeah but that 99% of the time that's called enablement that's implementation 99% of the time almost all of those customers have needs beyond what that is. So that so that's a sales cycle, right?

### **00:52:49**

**Taha Raja:** They sell the license. The moment they buy it, two months, three months down the lane, they hand it over to the account manager. Matt's job is to okay, now buy Netswuite connector or buy this and keep adding. That's how the cycle, you know. So we're still are we still on the enable features and

**Michael Flynn:** Okay. Hey, I'm going to do I'm going to do a quick call with to help him finish this up.

**Taha Raja:** stuff?

**Michael Flynn:** He's having a short

**Taha Raja:** I can take outside. Doesn't take too long. 11\. Yeah. Yeah, it's 9\. No, I'm just saying. I don't want to leave. It might take me 10 minutes. 15 minutes. Yeah. Yeah. Let's

**Michael Flynn:** Let's pause because I do want you to see this part because the rest of us were in the room for it. So, okay. Let's go. All this is is showing

**Taha Raja:** That's okay. That's the TV.

### **00:53:37** {#00:53:37}

**Taha Raja:** You want me to get with her now?

**Michael Flynn:** it that he's

**Taha Raja:** Having a shovel challenge with, but u he needs two help two things help. He had a personal account that needs to be merged. Okay. He's already signed in to the team account, but I think he's having I forget how you merge all It's just

**Michael Flynn:** I thought it was pretty easy. It's in the It's It's in your settings. Okay, it gives you the option

**Taha Raja:** And then I think then the next steps he was having some CLI issue which I I

**Michael Flynn:** I think it's tell and then he needs access I think or is having trouble pointing to that assessment folder.

**Taha Raja:** mean

**Michael Flynn:** Okay, three. So he probably doesn't have the Google stream thing. It says in his error is a G drive.

**Taha Raja:** on his folder

**Michael Flynn:** I don't um believe.

**Taha Raja:** but

**Michael Flynn:** So let me I need tell

**Taha Raja:** might be uh in a meeting Let me let me ask one of us meet with them.

### **00:54:32** {#00:54:32}

**Taha Raja:** Yeah. Oh, sorry. So, I have requested a next week next demo account. As soon as I get it, I'll provision everybody on it. Cool. Which account is it going to be? Say it again. So, there's certain data sets that have Netswuite next in them if you request demos. Um, AFA was not one of them. So, I requested a nonprofit since we've been doing some of those lately. But either way, you it's next week at the end of the day. Um, so as soon as we get that demo account spun up, I will give everybody access. How closely do we think that the Go ask you had something? I was just gonna super quick side note and it's very specific but uh I don't know if any of these automatically come with SEM at WMS and those but they're pushing that stuff so hard to to have the ability to demo that to a customer is really becoming pretty common. Okay. That dramatically held us up on bump party not being able to do it.

### **00:55:36**

**Taha Raja:** Yeah. The challenge is to keep them live because these demo they expire these demos in 90 days. I know. Um, even if you just if you're not using them though, right? No. Well, you can extend it, but they they eventually expire them anyway. So, and I'm completely okay with them spinning it up on an expiring thing because we have one client that needs something because that would have helped me with because what we had to do instead was hand that off to Netswuite and then it got very convoluted and they began trying to sell a whole bunch of other s\*\*\* that had nothing to do. Okay. and they didn't have the the they didn't have the context of everything I had just walked through on site. So they started going down rabbit holes of oh well I would do work order completions and do whip and I'm like John are you in the partner center do you have partner center access? Um I don't remember. Is that on my normal login?

### **00:56:27** {#00:56:27}

**Taha Raja:** It would be. Yeah. We asked them to give it to everybody, but I don't know if they have. So, what I was going to ask is how I know we said Netswuite next isn't all that great right now, but how closely do we think that that will be able to just like if we log into Netswuite and a new customer in 44 Chrome and going, hey, here's a file that has chart of accounts loaded in. Or what we saw was I don't think we'll know until we try it. Yeah, I think what they showed last year was more reporting. like show me the top 10 customers with this analysis then I don't think this will make changes not as they did not show it last year I don't think it's making anything eventually just as I said everything has a window like yeah every six months it's going to change yeah if we are the first one we have that first move advantage for like six months before somebody else yeah so they expire passwords faster than we do so you still you will have to That's just a new power.

### **00:57:32**

**Taha Raja:** So I wonder what AI they're using in their next what engine. Um choose the I'm wondering what agent do they use would be using under next maybe their own or it's not there's a separate process to add additional features to it. I can show you that I can be a non bottleneck. Yeah. Yeah. Um, okay. Let's review that. I'll help him out. Okay. Because I don't think, you know, he has the time, it sounds like. So, this basically just like I told you what I asked and it just outlining what was able to be done via SDF and and a little bit about why not, what's the what's done via MCP and then down the bottom is what I had to do manually. So again base features AR account economy periods blah blah blah was done assemblies work as landed cost was enabled matrix items was enabled um SDF reaches is narrow it can only manage well only manages feature toggles and true custom objects okay it can't touch subsidiary complication department that's probably because I asked it to try to do that um which is what we were kind of pushing on Um once we figured out that that it couldn't do those obviously I had to do some manual stuff but we got MCP wired in was able to update rename the default subsidiary create the second um update the address create the nexus um chart of accounts which is the basically the

### **00:59:11** {#00:59:11}

**Taha Raja:** remaining there was we loaded in there chart of accounts well let's pause a second because I would say chart of accounts is now moving into the next phase of actual configur like probably loaded the chart accounts. Well, I I stopped Justin. He's going to tell us whether it was successful or not overnight. It wasn't successful overnight, but it was successful right here. Okay. Uh just let me just go down. So, we got all the settings done before we left yesterday and we left it as we're going to let it try to chew through the chart overnight. So, going skipping down to the manual intervention, what we had to do. Quick question on chart of accounts. How did it know what could load? What was the input? We had the file that Ron provided us as part after the first uh working session and the working session itself. And did Ron provide the file in the format for Netswuite or No. No. That's great. No, he didn't. In fact, It was a multi- multi-tabbed Excel doc in it.

### **01:00:02** {#01:00:02}

**Taha Raja:** Okay. That also had the classific class classification location of the location department and classes. Nice. Which is so I I loaded it in once and was like, "Okay, now go add all these." That's fantastic. Great. Um multitask. It did come back and we iterated through it. Oh, yeah. Yeah. What What did it come back with? Well, like what do you want to combine with the Netswuite system accounts? Yep. Which which is what we want. So that needs to be something standard, right? that maybe we we teach it saying propose instead of instead of asking the consultant propose and then that way the consultant can make a decision make it. So I think what clouded us yesterday a little bit was the fact that it had actual demo accounts in there. Yeah, my blank system account like was pretty blank but it did have a chart of accounts loaded into it for some reason. It wasn't just the system generated accounts um which is what I've seen in the past but okay.

### **01:00:57** {#01:00:57}

**Taha Raja:** So anyway, manual intervention. These are the things I had to do that that SDF or CL cloud couldn't do. Inventory, multilocation, advanced, shipping, receiving, token based off, custom records. And it's telling you that you need to do these. Yes, it says, hey, I can update these. You've got to update these whether it has to be done before or after. I forget. There was some that had to obviously be done before. Got it. Um, use account numbers. I don't think it was that's an accounting preference, so it couldn't do that. Oh, there was a permission fix that was needed in the MCP RO. Did you add that? You added that in though, right? I did. Yep. So, it did the MCP RO didn't have list uh list subsidiaries. Okay. So, it couldn't rename couldn't even read the sub the subs. So, we added that. I told Mike so he could update the SDF as well.

### **01:01:50** {#01:01:50}

**Taha Raja:** And then still blocked, not done. Some of these just aren't turned on. So in this case, is the SDF basically um setting up MCP as well? Not yet. I wonder if it could though. So I don't know if it I I'm skeptical that it can install app, but I will I will ask and try to find out. But installing a sweet app feels like a bridge too far. But maybe I could be wrong. I mean it it literally takes a minute. Minute. Yeah. Yeah. I mean, we could just put that in our instructions. Although Although it has the browser ability now. So, oh, it has the browser tab. Yeah. Yeah. Why couldn't you tell it, hey, use the browser and go to this? Now, we're opening up a whole can of worms. In theory, it could use Playright or the the browser to actually do almost anything. Well, and and that may be the next phase, right?

### **01:02:45**

**Taha Raja:** I mean I I think look I mean the thing is the main thing is I what I don't want to happen is blurring the lines where people then just become lazy and don't even watch what hell's happening. Right. Yeah. This is plastic. 101, right? It's like managers get lazy when they turn over responsibility to somebody and then they don't take ownership of the fact that hey, at the end of the day, the buck stops at you. Yeah. I'll be at this point like so that that this is you have to think of it from that perspective, right? Because AI is not going to take responsibility, right? I only really use that playwriter browser capability for testing for having to test things. That's not a bad idea. I didn't think Well, I just haven't used it, but yeah. So, like I I think I'd almost like to not use it in this first iteration. Play right. I'm having a lot of problems because it it navigates well in many cases but in complex situations.

### **01:03:49** {#01:03:49}

**Taha Raja:** We should show you our Simpson portal and then you'll you'll kind of appreciate that. So, so playright is a MCP tool that's available to plug into any AIB uses it well where it can actually open a browser and click around and do things. So if you like so if you run into something where an API and you say I have to do this to the AI, you can have it as part of your process where Claude will just open a browser and start trying to do things. It's remnants of the where I found it works best is if you're in the middle of designing something with UI where there's UI elements and stuff and you want cloud to just open it up and check it itself and see did I do a good job of putting that button where it's supposed to go. That's where play works really well. If you're trying to do website scraping or something, it's hard. It's It's weird, but it does it on your you see you see a a Chrome window open and mouse moving around.

### **01:04:57**

**Taha Raja:** Does I see that when you use CL in the browser on the side panel? It's the same thing. It's the same thing. I think they're just trying to make it faster and easier. Yes. because each browser renders differently by having their own browser. I think they're controlling that process to make it more easier to navigate. Y I think that's where they're going. I don't know for a fact, but that's I think where they're going because in the project that I'm trying to do for FMW where we're actually scraping a vendor's site to obtain availability and inventory positioning. Um if it opens Edge, it can't find it. If it opens scope, it can find it. I mean, it's just got problems. And that's the thing, right? And the thing is because and like like Ron was saying that if the if the data from one screen to another for the same type of information, but because it's a different item, it shows slightly differently. Yeah. The AI is having trouble making the decision in the gray area to say well I can extrapolate and say this is the same thing.

### **01:06:05**

**Taha Raja:** So essentially a human being can easily make that decision trying to do the same function on uh a sales order but with a diff when you open one it's and it's form A and you open another one it's form B it would shut itself down. Yeah, I mean you know yes I mean and the thing is the variations are endless in the situation where you need that that fuzzy decision making process where a human being takes a look and can say well here that's general intelligence which doesn't exist today in AI right a human being has general intelligence to say well I this is the same thing even though you're not 100% sure you're going to make that decision because you're 99.9% sure because you're seeing it your experience is telling you right? That this is what it is. So it is and you may have transaction history in your head. You're like, "Oh yeah, I've done this one before. I know exactly how this work." All those things are limited, right? And that's the thing. So that that's the and and when I this project I took on because I was like interested to see how well it would do.

### **01:07:07** {#01:07:07}

**Taha Raja:** Yeah. And it it's just like, okay, this is endless endless amount of instructions and I'm back to programming again. It's like this is not working, you know? Yep. Um okay so some things that it didn't do some of them are blocked but some of them I think like um sweet flow I enabled it but it well I'd say they came back re not enabled I may not have enabled it um location department classes uh explicitly deferred the data is ready but it's not built yet um 2FA policy IP security no API path there Um, admin email reassignment. I don't think I add asked to do that, but it's it identified it. Um, okay. So, back up to Okay. MCP. MCP was able to rename the the subsidiary, add the new one, add the chart of accounts. Right. So, we you want to go in the chart of accounts now? Yeah. Well, so once we got everything set, we said, "Okay, now we're going to load in an additional call." Right.

### **01:08:12**

**Taha Raja:** So this is like we were on site for yeah we did the basic settings we came back and had our record to report call. So we loaded the record to report call in and said hey first thing we always do is set up chart of accounts. Here's the call. Here's the file he gave us after the call. Yep. So I'm just interested to see you know could we build into this portal process for implementation. Ask for this. asked for this like even the the larger steps right yeah yeah okay um I'm telling okay we will implement in ours implementation sorry no I I don't disagree with you I think this is where the journey is going you know this is uh you have to replace QuickBooks. It has to be that quick. Yes. And it and it maybe for something like that. I talked about the interview step before and then it just maybe it's a maybe we're not quite there yet, but maybe there's an interview and the results get handed off to a very junior person who can go through and do the clicks and and do some of this stuff like Yeah.

### **01:09:25**

**Taha Raja:** you know, we get somebody even more junior than like or Charlene in the Philippines and they can just, okay, the end that we interviewed the customer, here's the script that looks something like what Justin's got on the screen here. You just follow the script and you know, we'll be up and running by the end of the week. Well, that's the thing we as PowerCloud, I don't think, work with those customers. No, unless we start like what's the name? Emily would know there's a full team of sales who sell to those kind of customers who just want to pay $5,000 $10,000 for implementation or table. We deal with a lot more complicated $100,000 deal type of customers, right? So, so it it was able to load the chart of accounts. It did take some iteration. We did have to go back and you know there was it was which is good. It was asking questions about system generated accounts uh and when to reuse them, you know, not create new ones. Uh obviously it expla explained the limitations around like undeposited funds and stuff like that.

### **01:10:30** {#01:10:30}

**Taha Raja:** Like can't just get rid of that. Uh and there was a couple other accounts I forget now. But um long story short, it was a after a little bit of going back and forth. I tried to run it last night and I ran out of tokens. So I just ran it this morning when we got here. And if I flip over to the chart of accounts, you'll see undeposited funds still does need a a number. Um I think I I might have said no, that's a that's a general number when I turned on accounting numbers, but it has gone through and trimmed added all theirs in their numbering with the hierarchies. Um and actually looking at this from what I know of their live account, it's it's pretty spot-on. I mean, I can see Um, pretty much everything I need right here. Remember how many back and forths we had with RMR just to get the chart of accounts numbers list. I think it took us weeks to do this. I don't know that this even would have helped RMR.

### **01:11:31**

**Taha Raja:** But yeah, the prerequisite is always the the data quality has to come from a customer which is sure ready to be updated. So there's a couple accounts like undeposited funds which I to be honest I know for a fact that they they've renamed that to like accounts receivable strike. Um, right. Uh, so again, like that some of that this is to the point now where it's it's pretty it's it's pretty close to what we wanted. And if there's a couple of manual edits, maybe that's okay, which is normal, right? as you go through and they say, "Oh, now I understand how this feature works. Actually, I'll add another account here. Yep. That's part of the process. Yep. Which is But again, for the most part, it did do what we asked it to do. And if I go back, it'll probably tell us 126 accounts created or renamed into full three-level hierarchy. 113 brand new, 11 system accounts renamed, renumbered. Um, one system account deferred revenue deactivated.

### **01:12:28**

**Taha Raja:** I don't know why we would have done that, but forget deactivated. Yeah, I'm not really sure why we did that. But it'll become a problem. Um, 13 demo accounts renamed legacy uh and inactivated to clear name collisions. Um 77 remaining demo accounts inactivated subsidiary assignment fixed on 11 reused accounts. It was inheriting holdings via include children. Uh but yeah, so I mean I think we got through to the point yes to yesterday with this one that we were able to enable general features and load the chart of accounts without really touching Netswuite very much. Yeah. So I think this was good. There was a little bit of gray area thinking through here that it had to do around when do when what accounts do I rename? What are the account types? Some stuff like that. Yeah. So that's good. Is it do you have the file that you used to upload? Yeah, I am eager and again I don't think it's I think maybe we should do this as a followup.

### **01:13:48** {#01:13:48}

**Taha Raja:** I would love to get into a more working functional area like an order to cash or procure to pay. Yep. Where it's got to make some interpretations. It's got to make maybe some calls about hey a this adding a field here this that does X would be a really way to solve this concern that they had. Like that's what I'd like to see next. Yeah. But maybe we can do that as a followup sometime next week. Yeah. Um because that's the next step, right? This is there was a little bit of decision- making and stuff here, but it was pretty straightforward. I'd love to see how it can chew through some real problems. I I also think that some of the things we worked through there, we could probably put in the feedback loop to train the the agent. So they doesn't have to ask all those questions over again. Yes. like the like the interrogate like okay here's what we learned from what the from yesterday right the you know we don't want you to keep all of it because some of it's really specific to a customer but in general do these with like the system accounts or whatever.

### **01:15:02**

**Taha Raja:** So I've asked it to add this feedback loop and like every time we make kind of a call or a decision or to update its own knowledge base, right? But for things like MCP capabilities or SDF capabilities, go ahead and record those. for things that are more business process and customerbased decisions. Ask me if this is a best practice that should be added to our best practice list. Yeah. Or if this was a one-time customer decision that we don't need to put as part of Yeah. like a specific use case. So the SDF limitations which we had are we we have no control over those. Those those are net street whatever they allow to be fair. Now MCP is a little different. So we can write scripts and that are called tools and add those tools to MCP to give it additional capabilities. I don't know what the limitations of that. I'm sure there are still some limitations, but for instance, one of them was Pesh was saying, hey, I can't I really want to, you know, have the MCP evaluate the scripts that are in this account and it can see the deployment record.

### **01:16:20**

**Taha Raja:** It can see the script record, the script file itself. So this is the script reader suite development project that I built that allows it to now navigate the uh file cabinet. It allows it to now open files and read the contents of files. Um it it actually has four skills that are built into it which has been extremely extremely helpful specifically at like temperaments and I'm sure other places but that's the one we used it first. Well I did at least. Yeah. So that is something that's kind of how you built it for right. Uh yes. Yep. So that is something that we've been able to expand the capability of MCP. Um let me see. I'll tell you exactly what it did. So if you you see this is the file that I loaded in. Yeah. And this and this is this came from Rod. It has way more information obviously you can see than than just the chart of interpreted that. So yes, the chart of accounts is here, but really this is what was imported.

### **01:17:34** {#01:17:34}

**Taha Raja:** Okay. And the reason because it kind of broke out with the with the parent accounts as well, gave the hierarchy. Now I'm sure if we did this table on the first tab, it probably would have fine, but for whatever reason, he separated it out. But the NSID column was mainly which what we identified like 119 is the is the S is the normal accounts receivable account. So we knew that we didn't want to create a new one, right? So, we just basically took here's the existing accounts, reuse or rename them where you see fit, and that's why they have some NSIDs. So, so here's what I built. They uh and why this I'm reading from a readme document that I created. The Netswuite MCP server is excellent at returning records, metadata, and query results, but cannot open the body of a script file. The built-in SweetQL tools can tell you a script's name, type, and file size, yet never a single line of its code because the file cabinet's content isn't exposed to SweetQL. Script reader closes that gap.

### **01:18:39**

**Taha Raja:** It deploys four readonly custom tools into a Netswuite account that surface inside the same MCP connection you already use. Um with them the assistant can open an existing customization, understand exactly what it does and flag mistakes or inefficiencies in conversation. So four tools um script source return the real source of a script by custom ID internal ID name file cabinet ID or both or path sorry uh line range line range paging for large minif files. List scripts is a skill that MCP now has thanks to us. Discover scripts with optional name substring script type filters. Read file read any file cabinet text file XML JSON CSV templates binary files are refused not dumped as base 64 uh get script deployments return a scripts deployment record status log level how and when it actually runs. So those are the four new capabilities that MCP has. When you say MCP has like our MCP has right not if my friend downloads he he would not have or or is there a skill available for everyone to download? So yes so MC so nets so MCP at a high level is just a protocol.

### **01:20:07** {#01:20:07}

**Taha Raja:** Netswuite has an MCP connection that they have pre-published with a pre-built set of tools and then we can expand upon the tools by uploading these four scripts or one SDF file into that. So no, when you install a sweet app, you get the base set of tools, right? And that's what your buddy would get. We've added tools to that to that box now. Yeah. Um I mean so yeah so basically that's it. Like I said, I can I can definitely go deeper into stuff um you know, next week because there's certainly fields in there or even on the items like items items have, you know, different attributes, right? They're not they're not using major But they, you know, they've got attributes like that are hierarchy of and you guys had a whole conversation about whether you should use matrix items or not. And like I'd love to see it just evaluate your se working session on that. Yeah. Feed it in. Say, hey, did we make the right decision? I think that's a good one actually.

### **01:21:18**

**Taha Raja:** Yeah, we don't have to go and listen if there's extra time and you want to push this thing all the way to the end and see if it'll just build 44 then great. Um, the other thing that we researched and discovered yesterday is that the Celiggo Mi are fully available to us and really powerful. Oh, yeah. Claude couldn't figure out without having access to one whether it can get into all the options and stuff for pre-built connector apps because it seems like according to what I was reading, they're all a little different. But as far as building flows and stuff from scratch, it can it should be able to do them. So we have MCP access at 44\. I looked and I couldn't see a MCP server at 44\. Oh, and it's legal. Yeah. Okay. So it's probably No, the the you have to create one in Siliggo. You have to create it. I tried really quick and couldn't get through it. So I mean we have we have MCP installed on in the net suite.

### **01:22:24**

**Taha Raja:** Okay. Um but we've the point being we've asked them if we can use it and they've agreed. So if it if that's a good test bed and say okay create an MCP in their Siligal sandbox and see if we can connect to it. So Sasha knows how to enable MCP on on because they're doing it right on I guess so on on Celiggo. Yeah. So yeah I know they're doing this for Foundry right now. I I I didn't try too long. I just tried to see if I could do it really quick and I just bumped into some things I couldn't get past. But yeah, there but this is a good question though because even in Celiggo there is going to be things that consultants can do versus you know others can do. I mean you know so we got I think we haven't really dug into that really in detail and I'd like to get development's input into that as well. But I think it's worth it because like the monitoring thing that you did for is it 44 Pro, right?

### **01:23:18** {#01:23:18}

**Taha Raja:** That that Yeah, that's just the API though. No, I understood but again in the same vein, right? Yeah. And then you know like if there's a simple mapping addition or change, it's like well you just do it. But I mean Yeah. Yes. Um but like if there was a whole development of our entire flow, maybe that goes to development saying, "Okay, you guys figure it out using Celigo, but then it's all in the in the portal." So, I mean, I know this is crazy, but it's just another thing that I think is beneficial to be in the portal. I agree. It needs to Yeah, a monitor for it's a legal monitor for every account we have. I mean I love for in in a broader sense, integration monitor, right? I mean, yeah, you know, something that allows us to say, okay, in this integration tab, which are the systems that we're monitoring for this client and then, you know, the AI is aware of all this. So, yeah, absolutely.

### **01:24:16**

**Taha Raja:** So, I think this last part has been the most promising part like that was able to Well, this is what we have been talking about that can it do this successfully and this is a good first test. Yeah, good first test. I think we proved we can is it is it perfect? I I mean perfect. Is it great yet? No, but we it's a first pass and we ran it through some walls and we pulled around them, right? And and hopefully we'll have, you know, self-improvement loop which I put in yesterday and we'll be much better once an actual agentic guy gets involved into it. Yeah, but these could be good inputs. I think I think one of the things that I want to do is synthesize some all these discussions over the three days and come up with a process that we can have meetings with the development team about this. Right. Absolutely. Yeah. Yeah. So I think if we take the recordings we'll take the repo of this process that I already have feed it back in and say hey what do you think?

### **01:25:11**

**Taha Raja:** Yeah. And uh come up with some stuff and then take all of that and give that to Ashot and Yeah. and even give him access to all the raw information too, you know, because he can surmise some more stuff out of it and we got to come up with a plan because then if he can start even designing something even if stuff that's in beta or in alpha, we start utilizing it. Yeah. Because that the best way is to start using it and iterating it very quickly, right? We have to do this very rapidly. So, so I think what he could probably do really quick is update our doing this in the cloud interface to make it better and then he can hand that back to us and go start building something. Yeah. Like put take what we've done, understand the the roadblocks that we and put the put a playbook together. So it's like, okay, okay, here's what we're going to do. So we don't there's no question you don't have to run into the wall for it to say, hey, you oh, you've got to do this.

### **01:26:05**

**Taha Raja:** Yeah, because we can go in, we've got to enable a handful of features to get SDF installed. Okay. Well, while you're there, also do these five because you're going to have to come back and do them. Yeah. You know, and like and there's going to be some stuff, right? Like if you have to enable four features just so that it can turn on two, it probably makes sense for you to put you to click all five boxes, right? Like let's not go overboard here, right? Yeah. Agreed. So I think well Betty So maybe if you just outline the features then like hey here's you need to go in and turn these on do it pretty much get all the enabled features done. Yep. Hook up SDF even install the MCP app. Then you're kind of done in Netswuite and then you can just okay what's next? All those are done. What's next? Boom. Like what is it? Set up the SCS.

### **01:26:56** {#01:26:56}

**Taha Raja:** set up the projects cuz that all happens like in the background. and you can just say I'm done. Go do that and create an agent to go do it and go continue to do whatever you're doing. Yeah. So I think so we've done the pre-sale we've done the pre-sale stuff where or premere pre-discovery stuff where we get a list of questions. We get some unknowns. We get some baseline to go out and do our discovery. We've done the deliverables after discovery. We've now done the first basic setup of Netswuite and even the implementation of results of our first working session being the recorded cache. I think the thing we wanted to spend some time talking through today with um is more general project management type stuff, right? So we do working session, we come back in here, we give it the recording, we give it any ancillary files, kind of work through that. But outside of that, what does this look like for, you know, I'll go back, I guess project management is the right word, right?

### **01:28:08**

**Taha Raja:** of monitoring tasks, of monitoring emails that come in, of preparing executive summaries, which I think is the most obvious one, like what what would we like out of a tool, a skill about that on just a more highlevel ongoing basis, right? I think we've got a good handle on how to attack a specific task or process even. But like how else can this help us in a big picture managing the customer start with Taha's skill built as the basis for this? Yeah, I I I think so. So I think um so we we are we absolutely should be doing this in the sense that you know we've talked about this from a management standpoint of executive meetings meaningful executive meetings and meaningful updates to the client of where are we because telling them just to go to Asana board we're having trouble trying to assess what is saying to us you could imagine that the client has no idea what what's happened in fact they're been refusing sometimes to log in. They're just getting emails and stuff like that.

### **01:29:25**

**Taha Raja:** So, how do we better synthesize that process? Now, whether Asana becomes replaced by our own tool, irrelevant because either way, there's going to be some kind of a tracking process that's going to be sent. Yeah. But I think sending out an executive email combined with a forced scheduled meeting with the client where you're reviewing that. Right. Right. So, you're doing two things. You're documenting an executive update and delivering a document and doing a meeting saying, "Here's what we're going to cover." Yeah. It should probably write a It's probably doing a PowerPoint for that meeting, Yeah. And and that's just a easy next step. I've not done that yet. But as of right now, I've created four different executives summaries uh you know for different customers and it did a in my opinion a very good job. Now the document looks great, the content looks great. I can't validate it because only the consultant who's working that could validate that. Yeah. Because but that should be a step that the consultant the lead consultant should be taking anyway.

### **01:30:30**

**Taha Raja:** Yeah. I think to be fair I think that what you did for 44 was was pretty good. No understood. But I'm just saying I did not know if that was accurate or not. No, I'm tell that's what I'm telling you. I think it was I think it was I didn't see anything that was how long at least. So yeah, there there is one over there. Um I don't know if I think there were between two and four pages. Okay. Now again open to discussion of whether it needs to be compressed certain things to be removed but the parameters were as follows. The parameters I gave it was look through the email. So any conversations that occurred in the past two weeks with this client needs to be part of the data input. Look through every meeting with this client and its meeting notes. Look through all of that on the past two weeks. look through the Assan system and uh I did not include the chat because there's no easy chat connector yet but I think was there a connector that we have I have something because my my brain reads chat no my brain reads chat but this this thing did not because you have to have a connector you know for everybody right so and and I haven't developed it so uh I know my brain does it But you know we I I'm excluding the brain functionality out of this because this has got nothing

### **01:31:56** {#01:31:56}

**Taha Raja:** to do with my brain. This is something that I want a repeatable process for every consultant to be able to do. So let me let me take a step back and I'll just say this. I think people probably are aware of this and know this but especially as we move to more MSP model where people are on subscriptions and the deeper we get in a project they may or may not be using all that many hours at any given time. A weekly executive meeting is becomes really important for the customer to know that we are still engaged, that we are still doing things for them. Um, so that they continue to feel the security and the value so that when they get to the end of their contract, they just don't see, well, I don't really need these guys that much. Maybe I don't need to renew this contract. Right? We want them to feel feel that we're continuing to be engaged with them even if the project has moved into a steady state. This continuous communication, This continuous check-in is important so they don't just forget about us and when it comes time to renew say, "Oh yeah, I didn't even know we still had that. Forget that.

### **01:33:09**

**Taha Raja:** We don't need to resubscribe." Wait, what do you mean the forget about us? Okay. So, let's say you move let's say that post Go live you moved into very steady state um and we've moved you onto a managed services platform. In fact, the the idea is that everybody's going to be on managed services even during the implementation phase. But um let's say quite frankly, we're not doing all that much work for you. Then what would the executive summary have? Well, I think that's part of what we're here to discuss, but I think it can be looking for opportunities. So, I think the executive summary document is something that helps you hold a meaningful face-to-face executive summary. This is not something you just deliver and forget about. Yeah. So I guess having that human meeting is very very important. We're finding that out with retrofit, right? Even though I sent the document, it didn't work. So what Oh, he it worked. It backfired. I will tell you what backfired.

### **01:34:13**

**Taha Raja:** So I think question let's say we get to a very steady state where work is slow. Yeah. I I am saying that a weekly executive call is important to continue to tell the customer that we're providing some value here. I think Eman's question is fair a fair one. An executive summary that says we didn't do anything this week might do the opposite and tell them that you don't need power cloud anymore. Because I don't know how MSP works. I've not I've not been in any MSP project. The projects I we don't even have one at this point. No, you have a few but um there has to be some engagement also, right? No, but no no it's not MSP. Look, this is not just MSP only. Yeah. No, I I think I was just referring to one of Mike's point. But I'm interested to understand from the context of this conversation, what was the challenge with retrof? No, there's no challenge. That's the it's a personality.

### **01:35:08**

**Taha Raja:** So the first thing you said, oh Tai is throwing me under the bus. I was like I'm not throwing under what? But did you This is exactly the effect I wanted actually, which is great. So I'm glad he thinks that. So I opened the ripple. I was like, I'm the one who made it. So it actually worked. It's not If didn't backfire, it's forward fire. It's a mentality, right? I feel sad for people who think everyone is just after you. You're not that important, man. It's stating facts. These were the errors. Somebody you are working. We are working on this. This nothing going under the bus. Childhood trauma. It's a mentality thing, man. It is. He was abused by his dad. Okay. So, uh that was a picture in not all childhood traumas that kind of abuse. But no, I'm just me messing around. Uh but okay, but let me let me say this.

### **01:35:57** {#01:35:57}

**Taha Raja:** Okay. So, I want this to be an element of how you become more of a consultant and advisor, right? No, I completely this is this is to me when I finished doing this I was like we've been asking for this but we've not had the ability to crunch through the data. Yeah. Yeah. The the the the the thing that AI really helps is to crunch through two weeks worth of data to say what is this? In fact, Mike and I are under the discussion. We even want to eliminate the weekly report you guys put in with the summary and feed it from this information. Yeah. Because there's no need for you to put that summary every week. Oh, you're doing this is far better. Absolutely. Yeah. You're getting a couple You're getting a couple sentences. Yeah. Because to be very honest, there's a lot of consultants who just meaninglessly put green, nothing to report. When when I go to MCP and ask what happened in two weeks, there's a lot to report on.

### **01:37:00**

**Taha Raja:** Yeah. I mean, customer mood is something we have to solve. I think that's still important. But but yes, nothing makes me happier than when somebody's giving me all green check marks for weeks and I get a call from a customer that nobody's helped me out for weeks. We've had this problem. It's happening every single week and nobody's fixing it. And and to be very honest, it's it's an opportunity that if you didn't get any calls or anything from the client, Absolutely. You could potentially even add the MCP server as a way for Claude to even look in their system saying, "Hey, is everything okay? Are there any major red flags?" identify efficiency and identify things that are popping up for you and send it to the customer saying, "Hey, by the way, Mr. Customer, I just want to bring this to your attention. It may be a non-issue, but I want you to see value that I'm telling you this is a problem." Yeah. This is this is just one of the one of these areas that again never had the capability, but it's also just a weak spot for us as a consulting business.

### **01:38:04**

**Taha Raja:** Yes. That uh that AI can greatly enhance it by by giving us visibility to what's happened in the last two weeks. And because inevitably there's going to be things you're like, "Oh yeah, I forgot about this or I wasn't thinking about this." And then maybe being able to proactively explore other opportunities. And I think this also brings like for 44 Pro, I'm trying to convince these guys like, dude, you guys are making a mistake and not engaging us the way we're asking you to engage us because we're trying to give them a full-blown MSP plan that's all all-encompassing. Yeah. And and they're already burning more hours otherwise. And I told him, I was very blunt with him. I said, "Look, I'll take your money any way you want me to give you want to give it to me." You know, being the fact that you are a longtime valuable customer, I'm trying to give you a better route that will be a win-win for both of And like I just and I talked for a little bit yesterday, like some of the reason they're pushing back so hard on this stuff is probably because we just went through this negotiation with them and they are feeling the pain of their decision.

### **01:39:16** {#01:39:16}

**Taha Raja:** It's okay. You know, remorse and all these other things are part of emotional things that unfortunately they have to figure out. I can't we can only assist them with data and then they have to make come to the right decision. But I think this is so by the way, I'd like for one of you or both of you to run in this session today against another client the executive summary using the steps that I outlined, right? And the steps is very simple, right? You have to just make sure your email is connected. Mhm. Uh you have uh um Asana MCP connector authenticated against your username. Yeah, the connector is already there right in the team account. You just might have to reconnect, you know, using your authentication for the hours analysis. Calendar you don't huh calendar calendar. I did calendar as well because that allows the it to find the meetings and the meeting notes that happen with that client. And then the fourth thing is the hours analysis which you do not have access to using the traditional MCP connector for next week because you guys don't have permission for that.

### **01:40:33**

**Taha Raja:** Power cloud instance power cloud but you do have access to the report that Mike gave you. You would download that and feed that into this process. Yeah. And maybe we can beef this up and build it so it just uses an API call or something like that. Yeah. Um in the future. So certainly when we build it into our tool, we'll probably do something like that where it just it know it we'll put the customer ID or something somewhere in the tool and it'll know how to go into Netswuite and find the tasks and yeah and maybe there's even more it can do with the task creation and all that stuff. But yeah, but again, this is the first iteration. So I'd like for each of you to take one of your other clients and give it the window. The the window of how much analysis you do would be based on how often you're having the executive meetings. I think a bimonthly is probably a minimum. Every two weeks.

### **01:41:35**

**Taha Raja:** Every two weeks, right? But you know, if it's a fastmoving project, maybe weekly it warrants a week. Yeah. Like that's how I was going to go. Like we we were saying weekly and I feel like when a customer is in that really really stable state, it might be it might be more annoyance to them to do it weekly when there's not. Yeah, I agree. You know what I mean? I agree. It might be bi-weekly. That's what I'm saying. But a newer account like a temperman's is like I want to use this. I'm going to run it for Timmans because I have a call with them Monday. You can use it and I want to use it in that call and I might not be in this one just because it's new and I don't I know we want to talk about specific topics there but hold a separate meeting. That's what I'm saying. You know yeah don't that's our executive call. I have a every every week executive just but you know synthesize what what I would do is if the report is usually one two maybe three pages deliver that as a deliverable pre prior to the meeting and then have claude maybe create a short presentation just giving highlights of that

### **01:42:33** {#01:42:33}

**Taha Raja:** executive yeah and say that this is here this is here this is here so that you know maybe it's only highlighting some important things the rest is informational however you want to synthesize it but I think and I'm I'm I'm not going to tell you specifically how to conduct the executive meeting, but I think the information now is there for you to do one that's meaning. Okay. So, maybe one add-on improvement whatever to make to that is sort of an interview process like Mike was saying of what's coming next. Yeah. Because that's specifically what Peppermint wants to do. They want to talk about okay, what what's plan out the next couple weeks. So that's I want to say like look into Asana. You have all the Asana stuff. You have all of our conversations. Maybe even point it to the rapid assessment document to reconcile. Yeah, the the rapid assessment should be the tasks in Asana. So if that happens, right, you almost need that document once and never again.

### **01:43:29**

**Taha Raja:** That's um but but looking at the com hearing the conversations even internal conversations um of what what should be coming next can suggest and that's why I say it's an interview process because you have to interact with that because it's going to come back and say well you should do this next and we need the ability to say no that needs to be deferred or that was purposely deferred. Okay. Um so yeah. All right. So, I'm gonna run a fair point on the So, I mean, I think it it also is going to need some capability of being a little bit bigger picture or maybe maybe having a tracker of some things that were floated or mentioned earlier in the project that were deferred or were just decided nice to have but not important. Mh. And as time gets slow and ours are not being used, maybe it surfaces some of resurfaces some of those as suggested. Hey, this customer is on MSP. They're not using many hours right now. It could execute that fantasy they had for like back on, you know, you know, next week makes coffee for them first thing in the morning like, okay, maybe we roll that out.

### **01:44:55** {#01:44:55}

**Taha Raja:** So why don't each of you run this, Right. Uh, one for a different project than the ones we've already done and then let's look at it. So, all right. So, how I don't see the skills. So, do I need to add it or is it in co is it in code or co-work? Is it in code? No, it's not in I don't have cloud for power cloud yet. So, yeah. Yeah. Yeah. Uh, go to go to your bottom thing to see your exact summary. The skills there. Yeah, but it was you saw that it wasn't okay. So, let me do that. So, it you can invoke the skill in your prompt if you need to. Okay. You know, you can say, hey, but to be safe in this first prompt, make sure you tell it like if you read the skill, I think it tells you that it'll go to these places. I may need to update the skill to say, hey, I don't have connection to Netswuite's MCP, but here's a file for it, and we we can polish that up.

### **01:45:55**

**Taha Raja:** So last time when I created it, so I have everything connected, but I used your prompt to generate it, right? Yeah, I gave you a sample prompt that I created. I made the hours changes to it, but I used it. Okay. Okay. But you still want to use the prompt, right? Oh, there's no you you could I gave you a sample prompt, but you can synthesize the prompt to be more tailored towards No, I get it. Well, and now with the skill, you could use a slash command. That's right. Right, right, right. It should be smart enough to launch the skill on its own as needed. Yes, but I just do it explicitly. So, well, I'm going to do this right now. How should I kick this off? Like, what should I did it? Yeah. I mean, I want to do an executive. Did I send you the prompt? Oh, no. I don't know. Um Uh, can you share with him the prompt that I gave it?

### **01:46:41**

**Taha Raja:** That's the pro a sample prompt. So, that's the prompt. Yeah, that is that is the prompt right there. Okay. All right. I didn't know if that was the one you were talking about or not, but uh I named the client very specifically in this prompt, right? So, you may want to change it to whatever and you may want to change where it looks for some of the data. For example, the Google Drive is going to be different. Well, if you connected your Google Drive, it'll just know the folder about letter. Yeah. It doesn't care about the letter designation and all that. just polish that prompt up and I'm open to suggestions on how we even polish this uh this prompt up to so that you can standardize the prompt and just repeat it for different clients. I'll be right back. Okay. I'm actually I know the folder is not named temperament. But I'm not going to tell it that. Uh, where do I download the hours from next?

### **01:48:44** {#01:48:44}

**Taha Raja:** You go to your employee center. Then should have been a hyperlink you save. I want to go into that account. Mhm. So go into sweet life or how far sweet life but my link still my shortcut says new shortcut. Oh view. So you got to put your email in. So, so you'll you'll probably want to do I'm going to do it for governments right now. So, if you want to watch and choose your data set Monday. So, I'm actually going to go back. Oh, there's export because I'm going to go back because I don't want to include this week because I know my hours aren't in there and probably aren't either. So, it's not going to be accurate. Two weeks or last two weeks? I'm just going to do the previous two weeks instead of this week and change the type from provisioning and then I'll go tempest bundle export CSV and then it might open up a few new fields. Gotcha. So try to find uh try to find a um so like try to find a manufacturing or WMS data set to begin with when it gets provisioned for you.

### **01:50:15**

**Taha Raja:** If it's not already on there, then you go back in and ask for it. There are a lot of Yeah, I was going to say I'm sure it's huge. That's not that bad. Yep. It loaded the customer. Download the executive summary skill right off the bat. Grab a copy. I'm assuming these are like manufacturing premium JP that's Japan. Um manufacturing premium US. These appear to be country codes. Yeah. Okay. Yeah, I would I would bet those include but never sometimes they just include manufacturer mobile and then you can request the bundle on the back end of that. So, it's fixing Justin. His prompt was messed up. It says 44 and then it says peppermint. Oh, yeah. because he copied Taha from 44\. But you know, it's it's good enough to try to work through it. Sonnet five. So I was reading what are these sonnet fable? Yeah, they are like names of music tones you have or whatever.

### **01:52:20** {#01:52:20}

**Taha Raja:** It's from like music industry, you know. Okay. I think about that. So artistic what note is called what or something. So how are we handling the for the for those of us who don't already have claude for power cloud specifically you'll have claude by next week probably because we already have a a group license for FMW which we've been using but and I know you can easily in the app switch over to another account. Yep. So is is Claude expensive as of now or relative terms to like I don't know Asana and all these so asana is oddly like the most expensive thing a week for like it just cost way too much money for what it is. It makes me angry every what it is. Is that the main reason is that the main reason you hate it? No, I don't actually care about money but I just don't like it. just tells me what did we use before asana? I'm trying to remember. I don't know.

### **01:53:26**

**Taha Raja:** I can't remember. We used something else. Yeah. My issue with Asana is it only works if customer uses it also. Yeah. I don't really know. So few customers interact with it. Yeah. And and I think probably a lot of people get uh overwhelmed by the email notifications and then having to go back in all that. Yeah. And so I think if I think that's important to think about if and when if if what we're building is does replace and start to hold to be the taskmaster, how can we make it easier for the customer to Oh, no. I think that's not going to And can we make our group addresses like automatically post in there? So therefore, yeah, I would add that if if uh if everybody is moving to MCP and they're also including a sauna, it makes it much easier for them to also follow what's going on over there. Now, that may also long-term contribute to a different repository than a sauna for the data since it's not being used as a full-blown project management tool.

### **01:54:30**

**Taha Raja:** Yeah. Um because if it's super expensive, but then there's, you know, something either lighter weight or something we build that can effectively do the same things. I think the way it would work because it's not about customer not liking Asana or anything personal about it's just writing an email is much more convenient. Yeah. So we have to make it in a way that even the email comes in right it generates into a ticket or something which Asana in fairness has like you pull open any Asana project you can say what's the email address for this project and you have to distribute it and the customer has to remember it and it's an awkward long string so you have to they have to make sure that they save it as contact or something like that. Yeah. Um can we improve upon that? The answer probably yes. Yep. So everything I've written in the prompt, if I add it to the scale and just run the skill every time, do I need the prompt at all to explain things in the prompt?

### **01:55:50** {#01:55:50}

**Taha Raja:** I still have put in the prompt that run the skill but you pro I mean you probably don't want to get customer specific in the skill um right I mean it can ask me what customer I can just I can say run skill for customer name how did you get to the skill the first one so in customize u so connectors is where you build the connections it's connected to my calendar and skills once you build a skill it's just a forward slash command right but you don't you You could say, "Oh, you cannot see my screen." So, but yeah. Oh, this isn't your screen. You can kick me off. I got to do But I mean, you could just say, "Hey, run my weekly summary." Oh, gotcha. Gotcha. Okay. So, it's in that same list, right? Well, you have to provide the I had to provide We have to provide the file. Got the You're right. I mean, I could have just give me Yes, that's specific to what you want on that skill.

### **01:56:46**

**Taha Raja:** Gotcha. So, that's where he just copying and pasting. So, oh s\*\*\*. Fix it for you. Fix. Yeah. Yeah, Google chat becomes tricky too because sometimes there's the the group chats that are going the individual chats that are going on and yeah, sub team chats that are going on. I wonder if you name them though. You get really well just or they just say I mean it just seems like if it's if it starts scanning everything then are you burning tokens? This is looking through everything you got going on. Yeah, I'd like to get to the point where although we probably you could probably set that dashboard up to email like weekly or bi-weekly the hours, right? I mean, maybe we couldn't do it the way it's set up now, but if we wanted, we could do that just out of Netswuite, but does everybody want Well, I mean, does everybody want every project ever? I mean I guess well I guess what I'm say um yeah I mean if I have it if I if I if I or if it's already better yet if it's if it's in an accessible place that we don't have to download it and provide it.

### **01:58:51** {#01:58:51}

**Taha Raja:** Well, that's why I think like building giving the API give putting like an API token into the skill or the script or whatever it is we do that can just go instead of using instead of using MTP just give API. Yeah, you can run a search in it. Well, I mean, even your MCP has the ability to run that search. I mean, you're a user probably. We don't have MCP connections. Oh, yeah. Yeah, you guys can. So, maybe it's like build a a new MCP employee center role. Oh, that would work. Yeah. Can I do that? Huh? I'm sorry. Can an employee center role have MCP access? No, because I mean you could but then you would you would need your role to be limited to the data sets you would have access to. Well, so bigger thing is like can can I use an actual employee center role so that it doesn't license. I would be skeptical too because you'd have to turn all the token in. No, no, it's because employee So we're using only an employee license for you guys, right?

### **02:00:13** {#02:00:13}

**Taha Raja:** As Mike said, and you can't you can't customize an employee center role to add those kind of permissions. Yeah. You have to have a full user to add those permissions. Yeah. Yeah. Because the only roles that are available to you are employment center standard or customized. But in the customization of the employee role, you can't even add those permissions. Right. Well, I think you can't. No, I I've tried it, dude. It just doesn't allow it. I mean, we can try again. I've tried it. You have to customize the employee center role. It doesn't even let you guys. It doesn't give permissions to add. It just has like three or four different ones that Yeah. very limit like once you start like it doesn't open up the all the permission say okay add to new yeah it doesn't allow you to do that yeah because you can't trans yeah I mean otherwise people would be doing that all day long I mean yeah yeah that's by design but like theoretically you could make the argument that as long as the MCP connection doesn't get any more permissions than your employee role like Why shouldn't it be able to connect?

### **02:01:27** {#02:01:27}

**Taha Raja:** Ah, good point. But I don't think they have thought through it. I don't think so either. But I mean, look, for for our purpose, if we just automate the way that hourly data can come in, I think that's all that's needed for this report. That's all I had to do was that's the only thing I had to provide. Yeah. And it and it worked. Okay. I mean, it's running. It's still chucking through it. What about you? Are you Yeah. Which customer are you doing? I'm just curious. Grinds. Uh, we're gonna have I wish I brought my can. I wish I would have thought of grinds as a business myself, dude. Yeah, when I quit dipping, it would have been great. Yeah. I mean, I'm not sure what the negative effects are of putting caffeine in your mouth like that, but I mean, I would imagine you're doing it right now. That's true. No, but I mean, keeping it in your gum, you know, which Oh, yeah.

### **02:02:15**

**Taha Raja:** with that fabric and the chemicals associated with it. Even like with tobacco like Yeah. the effects of doing like a different than smoking it, right? Like the mouth cancer. Yeah. Oh, yeah. Well, because that's that's cuz the I mean like the old there's like fiberglass in there. Oh yeah. And there's there the rougher cut ones. Yeah. Like and well, think about it. intentional because it it kind of cuts your gums and it gets that s\*\*\* in your bloodstream. No, it doesn't. Now, you can't if you don't bleed like if I put a tip, you don't bleed. Um, that seems like a terrible idea. Oh, like like sandpaper. The gums are f\*\*\*\*\*\* I when I was used. Yeah, because I would put it everywhere. I put it way in the back and hide it. We weren't allowed to dip in college in baseball and I have one in every game. I can't believe and I would just like tuck it way back to that level.

### **02:03:12**

**Taha Raja:** And uh what's that? I can't believe a tobacco company would stoop to that level. Oh, of course not. But but yeah, like tobacco is not addictive. Remember that testimony I gave? Oh, but when I quit, will be there official. No, no, they've already they've already settled on that. FDA has Yeah, that's true. They're all happy now. They've all moved into vape all the vape companies like sweet business. Well, now the line you hear from all these guys and to what extent it's true or not, I actually have no idea. But that well, nicotine itself, if it's not being delivered via cigarette, is actually not a big deal and it's actually only good for you. Really? Who's saying this? I mean like Tucker Carlson like to me that that's the isn't that the addictive element? Sure. But if it's addictive but it's not harmful like I guess I guess which I have no idea if that's true is not true. Well, but I mean to be fair you do caffeine is technically not good for you.

### **02:04:15**

**Taha Raja:** But they're saying the tar and the tobacco and all THC. No THC. No THC and No, no, but I'm saying DHC. The same arguments are coming out about that. Oh, like the smoking the smoking it and the pulling it into your lungs was the bad part. And the nicotine itself is just caffeine. There's a lot of like newer things that are like there's like dry herb vaporizers where it's not a it's not like a pen, you know, like a vape. What is it then? it. You put dry herb in a machine and it just blows like super hot air through it and it doesn't combust it, but you still but it's still hot enough to turn to turn the plant into the THCA into THC, which is what makes it psychoactive. Sounds suspicious. You can like if you just eat if you just weed is not going to do anything to you. If you took it off the plant and dried it and then just ate it, it wouldn't do s\*\*\* or it would do very little.

### **02:05:11**

**Taha Raja:** You have to heat it to a certain point so that it to get the chemical out. Yeah. Essentially, it transforms it into whatever. People have been doing a lot of work to That's like themselves for thousands of years. Forever. Forever. Like edibles aren't combusted. Edibles aren't combusted. But if I take weed and I want to make edibles, I have to put it in the oven for a certain amount of time. Otherwise, it won't be potent. Yeah. I mean, just I'm guessing I read all the best thing to get educated. just f\*\*\*\*\*\* don't put the that's just the best forward. So in their office there's some crimes. So everything they had put like you know big posters of so the the two biggest clientele is athletes and military. The military yeah military allows this. Yeah they had like photos of Colin Powell. not calling P. Um something from a note from George W. Bush and they said what we do matters.

### **02:06:04**

**Taha Raja:** What we do helps our troops what we do helps our athletes like everywhere you walk through the corridor and bathroom just to give you the feel that what we do is very helpful and it's a positive thing. It's a positive thing for the society for the country. I was like maybe and like from an athlete perspective to me that's like you took the tobacco out of my mouth. You took the harmful s\*\*\* out of my mouth but I still want something and and I'm getting nicotine which makes me focus. It's not nicotine though. There's no grind. Yeah. Well, there's no nicotine and grinds at all. Don't they have a nicotine version coming out or something like that? Two versions. One is the caffeine. I don't know what the other one. So, it's not the energy version. It's just Okay. So, yeah, the energy. That's the ones I have. And it's just a white pouch. It's not coffee grinds. The coffee coffee has the caffeine.

### **02:06:47**

**Taha Raja:** This is not even coffee. It's just like a white pouch. It's just caffeine. I told him one of my colleague uses it and he's like, "Oh, yeah. We're going to send him a pack. Give me his address. Yeah. He really likes I did. I tried the grinds though. I tried grinds like because I don't because nicotine makes Where is grind sold? Like on a grocery store? Yeah. The same place you buy dip. Same place you buy all that cigarettes and all that s\*\*\*. Online because I've not seen it like on a grocery store shelves. Gas station. It won't be on the grocery store. Gas stations. Okay. So, you still have to be like an adult to buy it? Yeah. Oh, okay. That's kind of interesting because caffeine, I guess. Yeah. But like nicotine makes me sick because I quit. Like I quit dipping and smoking and then now if I have nicotine like it hurts my stomach like I don't even I don't like it.

### **02:07:31**

**Taha Raja:** So I I won't do like Zans and s\*\*\* like that and like guys are like oh man like before I go into a meeting chuck he's like I I I'm focused so much better. Oh I can't do it. I'll get sick. Okay. So I did produce their document. I produce yours also. Is it in the same format? No. Oh, mine is different. Um, so I'm going to open it and dry and see what happens. There's a bit of top lip. I would have got bottom one. Oh, top top shelf's the best. Okay. Really? Yeah. Why is that? I mean, that was that was towards the end of my dipping. That was like my preference anyway. really. Yeah. I think it's funny like part of me like you never got into the tobacco stuff so I don't really know but I do remember if you used bandits you were kind of a wuss like if you didn't take the raw tobacco.

### **02:08:34**

**Taha Raja:** Yeah. And now it's like everybody and their mothers just shove these pouches. Nobody dips anymore. Yeah. Like and Yeah. Um I I don't know if I think it for me like when I was dipping it was like a you could put a smaller amount in and it was like a tighter fit in your upper lip and like to be honest you got a good good little burn. Uh but my daughter's walking around doing the uh my kids started that's what made me quit Like Cam Cameron would like Cameron would like come and hang out and he'd be like doing this and I'm like f\*\*\* man I gotta get rid of this. They don't even know what it is. Started doing it. I'm like no idea. What are you doing? Yeah. She's like I don't know. The kids at school just do it. I'm that is like something people used to do with a dip can to like pack the tobacco. Yeah.

### **02:09:18**

**Taha Raja:** Like you don't even need to do it with a zin container. Like no it doesn't. Um okay. So, here's my executive summary report. This is freaking funny. Who's that? That's my LLC. Hussein was s\*\*\*\*\*\*\* on me. He's like, "What the hell? Where the hell did you get that name?" Oh, how did you pick that up? Uh, how did I pick it? I just said, "I'm looking for an LLC name, a software consultant." Where did you pick it up in this? Probably in my I don't know. too. I'm just not happy with him. Oh, okay. I just want a second. I basically just want to engage him for a second. Okay, good. Yeah, he he he he never asked. He was joking, obviously. But no, but he never discusses like I didn't know Mike was even asking. Oh, really? Yeah. He he never tells me who he's Did you know?

### **02:10:17** {#02:10:17}

**Taha Raja:** Did you know before this week that No, no, you gave me his contact. No, I gave you his contact, but then I didn't know if you had engaged with him. Oh, yeah. Yeah, but you told me. Yeah, he's been really helpful. I was actually kind of I thought about that like last night when I was late, but I'm like, s\*\*\*, man. Like I never called him. I should have like just touched base with him when I was here. You know what I mean? Because I've never met him face to face. Like I feel s\*\*\*\*\*. Yeah. Especially when I'm right here. He's he's fine. I'll just make sure he doesn't ignore me when he comes to Charleston like I did. Yeah. Uh, this is probably going to be a kind of a weird one because it's really way at the beginning like so it's telling me the and I saw this in in the notes when it was generating it, but it's it says like your assign project health is yellow because there's a lot of tasks and none of them only 5% five complete.

### **02:11:08** {#02:11:08}

**Taha Raja:** Yeah, but you you can modify that, right? Right. And I know it's because it's early on in the engagement and all those tasks have been loaded. Well, you can also leverage it to go, oh yeah, I haven't updated a sauna here, so let me do those things and then and then refresh the Yeah. Yeah. Um that's right. So have assessment engagement over the last two weeks. Two concrete fixes. I mean all this stuff is accurate and and very good. Two new work streams kicked off in depth demand planning. Yep. And it's kind of giving you some details here that even in your updates to make sure you use terminology like so we did this session what are our next steps on this. so that you can better update that so that it's easy for it to say uh and I mean like even like this stuff like are defined that you define those like even like this comment like this this sounds like it's a a negative that it slipped y it was intentional it was they moved it they canceled the first call with move and they moved it I like that it does that because if they keep moving it and then they come back and say oh we never did that like it's it's important that it's in there.

### **02:12:30**

**Taha Raja:** Yeah. If you want to deflect a little and say, "Hey, no judgment. This is just an automated generated summary. I'm not trying to place judgment on you. It's just saw the date slip and the date." Yeah. Um that's what uh Okay. So project held. No project updates were posted in SA. Um actively worked on Did this pick up the entire This is This is done actually. That's my fault for not updating it. Yeah, cuz like demand planning. I just need to tie that off and say the next the next thing the subtask in lineages are vendor prepayments. Cool. But like so like this this this next piece like I I could leave these two, right? And there's a reason why this is kind of they're waiting to Okay. lock bundle vendor engagement discussed but not confirmed. So basically we said we need to set up a call with net loan and we'll get on that call and and work with them. Yeah.

### **02:13:32**

**Taha Raja:** To see what we can do to improve the scripts but we can't do anything to it. Yeah. So so here's where like my feedback on something like that specifically would be like the way you just said that it sounds like the open item is on them to set up this thing. Yeah. I actually think the owner of this task could be changed. So if somebody is using a sana properly, they see that this is their task. Yeah. And that's why I I again I reflect that too. So that you may change the ownership and say that we're now waiting on net loan like in the update itself. Yep. So it can just pull the state. This isn't to be critical of that. I think but having a summary that comes out like this and you go through exactly this process. Yeah. Like oh yeah yeah. Yeah. This is this should No. And again, I'm I'm say I mean, we're being kind of out the last two weeks.

### **02:14:24** {#02:14:24}

**Taha Raja:** I haven't updated this. And you're right, this should go to uh whoever's scheduling the call with like those are the things that slip through for all of us, every single one of us. And get that's where this summary first coming to us internal can help us clean up the board a little bit and get ourselves back under control. Yep. I know. Absolutely. For the most part from here down, which is basically saying no activity is true. We just haven't gotten rolling on all these yet. And that's intentional, right? Yeah. So, do they have due dates that are further out if So, I truthfully I Oh no, dude. Some of them specifically saying and again that's probably because we haven't kicked off that process yet. So we don't even know how long that's going to take or when it's due. Yeah. So I wonder if there is some way for us we can say task with no due date. Don't add or these are all in sections.

### **02:15:16** {#02:15:16}

**Taha Raja:** So if it's in a section we can probably say hey if it's in this section we haven't started yes. So just ignore it. Or maybe not. Do do we um I I haven't looked at a sana on temperaments right now. Do we have do we have statuses on everything or do we just have blanks on the start? Um because I think the not started or not scheduled is better than blanks. Yes. And that could also give I um okay so these we're not showing this is annoying like these show status in the bar here. Yeah, let's do that. I think we are getting into the weeds. idea is the executive summary will be as good as the data behind it. Yeah. But I think but I think we can talk about how we better use this like I think and because I do think it's important to have a section that just these things are future tasks and we're not even intended to start with them now. Feel free to eyeball them, but like we don't need to call out that there's been no action since it's the classic rule of data, right?

### **02:16:22** {#02:16:22}

**Taha Raja:** Is is good data then responds well to Yeah. s\*\*\* in, s\*\*\* out. Yeah. Like like so my thought was this section rapid assessment work items is is be like like these are like to-do not started, right? So we like we now I I almost I started to say we shouldn't include them, but I actually think it's a good thing to include them to talk about what the future two weeks looks like. Which which one of these can we tackle in the next couple weeks? You know, I I think there needs just need to be some way to identify them as future state, right? And I wouldn't want to say ignore things with no due date. No, then if you f\*\*\* something up and it doesn't have a due date, you're not going to catch it. So we still want to be able to catch that. So, like we just need some way of tagging them as not started yet. Yeah, I think we just don't have status in that project for whatever reason.

### **02:17:14**

**Taha Raja:** I don't know why, but I can get it added and then update it. Yeah. Yeah. So, I think that that does help. That's why here it says health assessment yellow at risk and it's it's not that's not I mean, but I think how easily can we interact with this skill to tell it like okay, hey, we did this report. You're saying it's yellow at risk. In reality, a lot of these just haven't been started yet. Well, you're not interacting with the skill at that point. It's a chat at that point. Well, I guess because the skill is what the starting point is. Now, if you want to include that type of functionality on all subsequent then you want to update the skill. That's kind of where what I mean. If we if we find those things, so I think two things, right? one like if that is not a standard part of a sauna. We have to standardize our team, right? To say everybody identifies and classifies these tasks the same way.

### **02:18:07** {#02:18:07}

**Taha Raja:** Yeah. And then we could add it to the skill. Yes. To say, hey, move anything in a not started section. Anything marked as not started gets moved into a different section so that it's not jumbled with the Yeah, we don't need comments that nobody's worked on this for two weeks if it's a not started task. And the other thing is if you keep this executive summaries as a project that you share with all your team members then the subsequent executive summary will just get easier right it'll know it'll right and and so I think you this the the skill should be at a high level sure that captures 80 to 90% then the remaining 10 20% is captured in the project. Yeah. So let let's do that right. So because I don't know if everybody's seen that especially you guys like Imran's just getting used to Claude. So go back into Cloud. So this is a chat, right? This is not a code task. Uh yeah. So let's if you hit the plus sign at the bottom, we can move this into a project, right?

### **02:19:12** {#02:19:12}

**Taha Raja:** Add to project and should go into Justin's b\*\*\*\*\*\*\*. I don't think start new project. You just call it temperament uh weekly executive and then you can put it in the power cloud consulting so other people can see it and run it. And then if we go into our projects, we can probably put that primary prompt into our instructions now. Okay. And then you could add some context. that's temperament specific into those instructions on the right. Yeah. So next time you run it, it should produce a slightly better, more consistent version. Everybody understands that. I think Ron, it's important for you as well for projects. So projects are are are very important because they are shared instruction sets and everything. So So, like we could put the prompt into the limit the regular instructions. We could tweak the prompt. We could tweak the in We could tweak the instructions. Actually, you know what I like to do? I like to take the prompt, put it in a chat and say, "Format this as project instructions for me so that every week I can come in."

### **02:20:46**

**Taha Raja:** Yes. And just write, "Give me the weekly assessment." Yes. For this. That's exactly right. and it it will it will basically put it in markdown format for you. And you can just paste that in there. And you can even continue how to have that conversation. Um, you can do it in the project too. You don't you don't have to just because the project is mostly going to be used for something else doesn't mean you can't use it there. Going to leave that then. We'll just say sometimes it's nice to have that in the history of the project. Ah s\*\*\*. Just stop it. Edit prompt. Format this prompt as project instructions, but I can use it easily in the future and just tell Claude to generate my executive summary. Um, I want to add something. Uh, I'm going to change the prompt later. Yeah. So you might want to then pull out the example from the document and be like listen this whole section is a future state.

### **02:21:51**

**Taha Raja:** How can I best identify this? How can we best identify these so in the future these get separated on the summary so they don't look like lagging work. So one of the interesting things on that executive summary said no defined next step or no next steps have been defined. I went back and looked at my last update on demand planning and I literally have a section called next steps. But where is that? It's it's in the last update comment that I had on that task. Don't tweak the skill. Just reformat my prompt so that it's easily reusable as instructions in a project. Subtask and it didn't seem to pick that up. So that may be something we need to have it take a look at remaining subtask. All right. So here this is it. Well and then what does it say for hours? Does it say you'll provide it as a CSV file? I'll attach a file with this data. Otherwise pull it via the connector which it won't do.

### **02:23:00**

**Taha Raja:** Gotcha. So to use this you'd say something like generate my executive summary for whatever past weeks since it is already wired up as the customer skill in the project. That one line is enough left to trade on. So now now that gets saved over on the right I think at some point or today or something to there should be some standardization in the template also because mine looks different from his so we both use the same template or same prompt same skill generate my weekly summary for temperament if you open you don't want to go through the you just want this section as usual focuses temperaments we should come up with Um, you want your hours? I actually kind of wanted to ask for it. I did it on purpose. Well, it didn't take it didn't take the answer, so I'll add it. So it would not take the file he uploaded in a different chat because it's a new project. Probably not. I don't want my limit. Is that CSV just a normal from the my hours thing in the uh employee center?

### **02:24:14** {#02:24:14}

**Taha Raja:** Yes. And Justin has reached his limit for the day. No, for a couple of hours. Just sent a request to you. says so I can go and go pick a line. Well, no. I mean, this is on my to-do list to try and figure out how to do some analysis to figure out how much usage we'd actually need here. Um because again, it might just be it might be cheaper to give you guys a higher seat or it might be cheaper to just allow some overage. The the truth is I have no idea. I'm not I haven't really quite figured in out how to the new frontier analyze it. I guess the analyzation is to give to allow some overage and then go see how much overage we're using. So cloud builds by like what tokens seats type of seats all of the above. All of the above. So it has to be complicated otherwise. Why is it not giving the option to leave on at five and like makes no sense?

### **02:25:27**

**Taha Raja:** I mean, what are these all in order of higher low? I think so. Like like is Opus three higher than 4.6? I'd have you know what they changed so much. I'd have to go look it up. And actually there is suggestions about like I just go medium then that's probably that could be an issue. It was on high effort higher effort we takes longer users show it faster. Yeah. So, see Mike here is the last, but I think I mean it'll be good either way. Okay, hours logged. Okay, so it tell it says that it's an attached time export. I wonder if it attaches it. There's the last paragraph in the last update I did the other day. Yeah. So, I don't know to be honest. I haven't examined the skills so much this. Yeah. Yeah. No, I mean this is this is just a nuance that we can figure out. Maybe again maybe there's no maybe there's additional details we put in the prompt.

### **02:26:42**

**Taha Raja:** It's saying make sure you check the status of subtask. Yep. And uh if any next steps have been called out in comments or in the in the most recent comments. I don't know think it's using too much tokens or or too many tokens whatever. But I mean, for sure you don't want uh the executive summary to completely miss that when you're reviewing it with people and saying, "Yeah, none of this is done." And then you go look at the task and says, "No, it actually is done." Look, work session slipped originally targeted rescheduled multiple due to client attended attendee availability. So that's good. remember it. Yeah, it said rescheduled in the top, but then there's more detail here to tell them why. Um, and that's true. This is good. That's true. Sweet cloud plus like. Okay, that's I just responded to him. Um, this is the one I asked. We were doing some work. It was he was asking me like basically what I thought about their their current configuration and do they need more processor concurrencies and whatnot and the analysis that I did by pulling the screenshots from APM y said basically no you're good it's the scripts screwing you um no commercial correspondence okay that was that's probably That's probably related to That seems related to 44 cuz like

### **02:28:22** {#02:28:22}

**Taha Raja:** it's probably the skill knows that it did one for 44 and there was contracted MSP because it even says MSP up here too there. No, the sex track has no billable MSP flag. So ours are broken up by workstream which is fine. That's this is actually where it should be broken out to. Um That shouldn't be in a customerf facing document though. What? Like that breakdown, right? Like there's no MSP in place. No, I don't. That's what I'm saying. I don't know where it got the comment about MSP. You know what I mean? Yeah. Because that's pretty specific to 44\. At least in my world. They're the only ones that are on it. Right. So, I'm wondering where it got that. And was it is it related to Do you have It could be in the prompt, though. I didn't even look in the prompt or the skill. So I I don't know. It could be in the prompt.

### **02:29:20** {#02:29:20}

**Taha Raja:** Um I'm sorry. What was the question? So like it's pull it's it's saying oh there's no MSP flag here. So I have to look at this differently in in the summary. I probably shouldn't be right here. Hours logged. Yeah. I mean you know has no MSP. So it was broken out by work stream and resource which which is right. But so maybe this again because some projects have MSP, some don't. You know, my question was how did it even know to look to how did it even know about MSP? Does the skill know does the skill have memory and know that it created 144 potentially and that does potentially I think skill prompt both has it. What? Uh MS reference to MS. Okay. So, it might because I remember I adjusted the prompt with the um the name. No. Well, yes, but Oh, the instructions. It's the instructions. Yeah, but it didn't this didn't use the instructions.

### **02:30:14** {#02:30:14}

**Taha Raja:** So, you're right. So, the prompt has both MS prompt has MSP and even the skill t has MSP. Break it down by MSP and available. So, where is the hours? Yeah, I don't think it does though. Oh no, somebody logged hours in the past two weeks. Project over the past two weeks. I don't see MSP in here at all. It must be the skill that knows that it you know that it did that for MSP. Skill also has it. Yes. So we can I can modify the skill to remove or well how do we want to deal with that? So is it something that this could be part of the skill and then maybe we do it a project level instructions or I would think project level instructions would be better. Um so skill should know that the project instructions will contain an indication of whether this is an MSP project or a time materials project. Yeah. still can say if there is MSP mention it if not then just don't although to be honest like we're I I was just starting to say this too like let's not do that right now cuz why like I I for one example I'd rather not update a skill that we're all using for every customer when it we're going to have to review that all I got to do is delete that line okay you know what I mean like it's just hey that doesn't make sense now there's also a chance that I

### **02:31:40**

**Taha Raja:** miss it but I just have to know that so but I mean maybe once right so you or I might just say hey This is not MSP. Save that memory. Yes. Don't don't reference MSP for this customer. Yeah. Skill says split hours two ways. MSP versus billable use is billable flags. That that's because it comes from your API MCP which you do manage services and my my file doesn't have it either. So that that needs to be that that needs to be at the project level. maybe additional instrument and this is not an MCP MSP customer. Uh do not try to figure that out or whatever the the instructions need to be. So without twofold then if that's the case and I don't maybe you add to the skill pay attention to the pay attention to the instructions to determine whether you need to break it down by MSP. Okay. And then the instructions all you have to say this is not MSP. Okay. You know what I'm saying?

### **02:32:39**

**Taha Raja:** You know what I mean? I'll do that. Yes. I'll I'll update the skill um for sure. But I mean this is pretty good. Yeah, it's uh now um now obviously what would be the next step in order to hold that meaningful face-toface meeting? It's would be the process. I mean, I would I would think deliver these. So, I have a weekly call. It's on Monday. Uh I would say generate this Monday morning. Deliver it first thing. Give them time to review it and then have that call. Yeah. So, ultimately for when we build our tool, I feel like these should be automatically generated in a draft type view that's private. Upon approval, it moves to a customerf facing folder or something like that. And then Yeah. kind of like the working and deliverables. Yeah. And then this is what we Yeah. You schedule whatever day your weekly call is or let me back up.

### **02:33:45** {#02:33:45}

**Taha Raja:** Maybe somewhere in the tool we indicate what day of the week we hold our executive weekly call. And this and the tool is smart enough to know the night before or the morning of that call it runs it runs this because if I'm on Wednesday to Wednesday cadence that's completely different. Yes, but the twoe period can't be Wednesday to Wednesday. Well, this is well the hours the hours aren't going to come from Wednesday to Wednesday because people haven't logged their hours in Monday, Tuesday, Wednesday. Yep. Uh, now you can that's not saying you can't evaluate the calls from that time, but the hours should be from the previous two weeks. Yeah, I think that's that's a good call. Hours aren't complete until Monday morning generally basically, right? Much dude. So I at first I was going to say why not just generate all of them on a Monday morning, but if you're not meeting with them till Wednesday and you have calls on Tuesday, you kind of want those included. Yeah. So the two the twoe period I think needs to be two weeks trailing from the day you're delivering the executive summary.

### **02:34:55**

**Taha Raja:** That's all. I don't think we need to get hung up on the hours to the point of that day. You know what I'm saying? I think I think I think if if you have an executive meeting every Thursday, you generate it from Thursday morning and say, you know, trailing two weeks now. Yeah, you're right. If you if you've not added the hours from Monday through Wednesday, those won't be there, right? You know, which is why I say just go back to the previous two week two full weeks. Yeah. Hours are related to the previous two full weeks regardless of what day it happens on. Yeah, that's right. That way if you do Monday to Thursday, it's the same two weeks of hours that you're reporting on. Yeah. I mean, that's fine. What however you feel is appropriate for that. And the call the rest of it really is just if it's Thursday to Thursday, you're catching all of it, I guess, is what I was saying.

### **02:35:40** {#02:35:40}

**Taha Raja:** Yeah. Okay. Um I guess the meeting actually ends weekly summary and we work session work session. So this to me is important here now like we've got a recurring work session which is just called netswuite work session but when we determine the agenda for those calls I think it's important that we change it so that when it reports on it in here it makes sense like the demand planning session was changed Um but the two work sessions were not. So like it's kind of misleading what was discussed. The details tell you but um but it just says Netswuite work session. So I would change that. That's a per that's a administration thing on our end not a cloud thing I think. So yeah you're not sharing. Oh s\*\*\*. Yeah. I'm watching the source code. This is free only if you have ti. I thought TV was free. I pay like $25 a month. I could watch TV in Tanzania if I wanted to.

### **02:37:06**

**Taha Raja:** What is it? It's kind of one of those. It's just a pirated thing. Yeah, it's on the Fire Stick. I use TV mate. Probably shouldn't use thousands of channels, right? 15,000. Yeah. Yeah. I mean, I don't even look at all of them. Like I said, I can watch the news. I could watch the news in Tanzania. Oh, I'm sure. Yeah. Yeah. I've seen a lot of people subscribe to that if that's why and I think some of them have like the entire Netflix library in it. That's why I can watch um the Odyssey as soon as I might watch it tomorrow in my house. Yeah. But the quality is the quality good? It depends if it like right when it first comes out. No, not really. But as it evolves, it it is. Yeah. Interesting. Okay. Um, okay. So, cross this is where I haven't gotten yet, but I will tell you the Odyssey is is a great experience if you can go to an IM.

### **02:37:55**

**Taha Raja:** Absolutely. Yeah. I mean, I would those those I mean I don't say that about all the movies. Exactly. I would although I would not rate it as the best Chris Nolan movie. See, I don't really I don't really know. Yeah. Like for me, the Chris uh you know, other Chris Nolan movies were better. like well I like I love Dunkerk. I thought it was a very well-made movie. Uh I also loved uh uh Interstellar. Yeah, Interstellar was great. Inception was great. Inception. Inception though I it took me a couple of times to watch it to kind of completely get the movie, but it was it was excellent. Batman Begins and The Dark Knight were both Yeah. I wasn't as big a fan of the third one. still very good. But but uh the first two were awesome. Yeah, the first two were awesome. And I think actually the second was even better. Yeah.

### **02:38:47** {#02:38:47}

**Taha Raja:** And some of that was just that this Sorry I'm cutting you off, but this is actually good. This is this basically says you might get slapped for this action items not yet visible in a sauna and but that's the part I created. So this is important and this may be something you don't deliver to the client but it becomes an internal thing for you to review because what this is doing is looking at your meetings finding action items and task out of that and cross referencing with your asana and that's part of the skill. Yeah. And not everything may be true or whatever, but it allows you to quickly get a snapshot saying, "Do I need to surface these things at my executive meeting?" Maybe proactively add it before I have the executive meeting and all that. And it says like, and I wasn't picking on you, but this was your your act, and you've already done some of these, by the I know that, but it wasn't recorded in a sauna that you did the comparison of demand planning solutions for them and it saw that in your meet recording and it was like, yeah, that's not an ASA.

### **02:39:54**

**Taha Raja:** Yeah, right here on my screen. Yeah. Yeah. But it's saying like none of these attractive subtask tasks under P7, which is probably related to demand planning. Yeah. I didn't So, I didn't put the I didn't um Yeah. Yeah. No, I I was thinking about this yesterday. I forwarded it to the to them via email. Y uh and it's obviously well actually it was produced by AI so yeah it doesn't exist anywhere which it is what it is like no no that's something I was thinking yesterday I was like I should have added that as an attachment in a sauna so sees that but it missed the it missed the next steps that I identified on demand planning unless I picked it up on the second go round because I I couldn't I didn't run the go around, but Oh, yeah. Um, but yeah, it did have This is good because it not only are we going to be able to produce something that gives a good overview, it helps us better understand how to put in better notes.

### **02:40:56**

**Taha Raja:** Yeah. Yeah. Exactly. And making sure because that to me is like a, oh, okay, we see that you did this and we can report on it and tell them, but it's not tracking us on so do that. Yeah. So, let me And to be fair, I'm in the same boat with the Sweet Cloud Plus and the concurrency question because I didn't put that in the SA. I just answered them. Yeah. No, it's it's very easy that you for I mean, if it had my email, it would have found that, right? Yes. But to the or if you copied me on you have a when you have a multiple group there, you know, things like that like attachments, you should have a common area where you're storing that. I always do and like anything they send me as an attachment that I have to like look at and use, I'll either or both. Download it to download to drive and organize it right away. Put it in an attachments folder.

### **02:41:50**

**Taha Raja:** Yeah. Yeah. And or attach it to the task. Yeah. I've always done that if they sent like CSVs or things. But but yes, it's a good practice Again, I sent them something that was deliverable. Yeah, they all got it, but Asana is completely unaware. The hard part about the completely unaware. So, even if you added it to Google Drive, like the hard part of the sun is like the more files you have attached to the task, the more like but that one honestly belongs in the task. Sure. So, sure. And uh All right. Risking items. Okay. Pass through tasks. Again, we know some of this actually the NS prod is done. Um, stall assessment scope. Again, we know if they're on hold or just not started, we don't we won't get that. Unttrack work streams. We just talked about it. Flipped accounting session was on them. But I think this one, so this one's on us to fix.

### **02:42:55** {#02:42:55}

**Taha Raja:** just to make sure that we're updating tasks. These two should go away if we Oh, actually, maybe not. Maybe this one should stay. Um the the NS prod is my fault for not not going to complete. But see this this section five and six and all would be internal, right? You may not deliver this as a as something deliverable to the cloud. You may deliver a combination. I might. Yeah, I might. I I might I might use it for my when I'm reviewing going, "Okay, what's in five and six? Oh, s\*\*\*. I didn't I didn't update the task. Go back and do it and regenerate or just take it out." Do we want it to generate something that's more clearly a draft first that we can tweak and edit before we say, "Okay, I've made changes. Go ahead and polish this." Or or I I was envisioning a two-step process anyway. or the things that appear in five and six are interview questions that it comes back and asks us, we answer it or update it in a sauna and then say, "Hey, I've this has been updated. Go." Kind of as a it's the same same real thing.

### **02:44:08** {#02:44:08}

**Taha Raja:** You're just the draft. So what I don't want to happen is for you to give the answer in cloud and that answer cannot make its way back into which again in the future when it's one portal maybe it doesn't matter maybe it already doesn't matter maybe it can already fix it in claw in asana for us I don't want it I don't want I don't want you to make a change in the document without making without being aware or without asana being aware like you say, "Oh, actually we're not doing that right now or whatever. Don't don't worry about it." Oh, right. Yeah. That should actually make its way back to the official attack% like I just told you the NS product NS Prod access. Yeah, that's complete. It's It's saying it's late. That's my fault for not So with the interview thing, what I don't want you to do is just say, "Hey, this is actually about it." No, that's not what I meant. I meant I meant I read that and said, "Okay, it asked me a question. I need to go up that update that task mark closed and then say this has been updated." Something along those

### **02:45:14**

**Taha Raja:** lines. I what we need to do is I don't think the process needs to be finalized, but it needs to be started to be used. Okay. Sure. because I think then we can come back after two weeks of usage because we need customer to respond how did it go with the customer is the customer asking more questions that we should be including it all kinds of things right y so we need to iterate so I think the this is good data for both of you to start using this ASAP y and potentially even after you guys use it for a week or so have other people use it and I know and Mula I've asked them to use it as Well, let's see what they do with it. But at some point in the near future, I want this to be a standard process for everybody for every project. Yeah, it would be I would be expecting that though everybody who has a cloud account which soon we will deploy this to everybody is you would have a shared project for every client that you're working through these kind of things.

### **02:46:16** {#02:46:16}

**Taha Raja:** Yeah. Right. So just one question on um yeah I don't think you need to perfect it theorations we have get feedback internally from clients and all the point is we have to get started uh one question was well did yours finally finish by the way yeah it did okay let's let's look at that briefly as well so why don't you start sharing and then make your I have a call in two minutes I'll quickly take the call that's but the question was um again projectwise right certain in fact right now all my projects There is no exe executive call per se I had with retrofit now even that's gone right so you send out an email expectation is whether we discuss it in a specific executive call I do or I do it on a working session I start spend my first 10 15 minutes going through it I would I would what should be your or executive I think I think a project management call of 30 minutes should be scheduled separate from your working sessions okay and that way you invite other than your working partners.

### **02:47:21** {#02:47:21}

**Taha Raja:** I get it. But the at least some of my customers, the people I work with are the one who's going to be on the That's fine. Then but but then make it clear that the purpose of this meeting is to review because what happens is and you want to remain focused, right? Like don't allow conversations to go into technical solutions. use that call to allow you to summarize what has happened in the week or two week period and to get them back focused into the project that you've agreed on. That's that's going to be very important with Rod because he with Rod with I know with many customers he hijacks that call I know with pro new problems and it's like okay understood we'll take those we're gonna record them. That's right. These need to be individual calls. Yeah. And and you can be very blunt about that to the client, right? That hey, you know, this is a 30-minute call to just give you a review on this. Let's every time he goes down a rabbit hole saying, "Okay, let's I'm going to stop you, Rod, because we have a lot to cover today. I want to make sure we are hitting every topic that's open so that you don't get left behind

### **02:48:29**

**Taha Raja:** in thinking that we're not addressing everything that's open." Yeah. Right. And again, I'm not suggesting this is 100%, but you can drive that call. Right. And and as consultants, remember, driving the call and helping them behave the way you need to for the project to be successful is partly what you get paid for. And if they feel bad about it, that's that's their problem. Yeah. I would be I I would not have a hard time having a conversation if a client came to me saying, "Imran made me focus on a meeting." It's like, "Okay, well, good. I'm glad he did that." Yeah, that would be a very easy conversation with a client. Yeah, like I can see their push back can be and this is still we can get past it, but their push back, well, I'm already on the call. Why do I have to schedule another one? My day. So, because this is what this call is about. Well, you can say I only have 30 minutes today.

### **02:49:24** {#02:49:24}

**Taha Raja:** So, let me finish everything. If we have some time remaining, I'll be happy to discuss whatever, but I have a hard stop at 30\. Yeah. So if we don't finish, we'll have to do a followup, which I need to or and we need to Maria and myself hold them to that because they have a very very very bad habit of just spilling over and it's like guys like so I I always start the meeting first by always saying here's my agenda and here's my hard stop. Yeah. I always start meetings with that. Okay. Having an agenda at every meeting and reviewing that agenda before you start the meeting is very important. And then in that agenda should be any follow-ups that you want to do from your previous week or previous session. Right? And then of course ending the meeting by saying here's the tasks we've agreed on. Right? So that you have an input for the next meeting to say did you finish those tasks? That's how you kind of chain together your meetings and create continuity.

### **02:50:32** {#02:50:32}

**Taha Raja:** Sure. Yeah. No, I don't disagree. Like I said, I'm just I'm mentioning some of these things just to, you know, so we're aware of them, I guess. Is it not letting me? Um, do I did you did you do something to my access? My me talking to Mike. Oh, no. I have It's not telling me that I don't have I'm out of tokens anymore. Oh, I I just gave you some more. Oh, that's I meant. So, what I was going to do now is take this just assume this is good, right? That I'm not going to go back and forth and talk and tell it to fix stuff we talked about. We know, but I want to say, okay, now generate me uh like what do you think's a safe number of slides? I don't know, four, five. Probably. I'm I'm a fan of like less, right? So, well, that all right. Because remember, you're not you're not putting any fluff.

### **02:51:24** {#02:51:24}

**Taha Raja:** This is straight to the point. Yeah. So, you know, as long as you have the document in front of you to talk about through details and they have it as a reference, the slides can be simply something that allows you to have a conversation, a web conversation in a meaningful way, you know. So, put me a four to five slide PowerPoint presentation together to help me present this executive summary to Pepperman's on my next call. before I send it. Um, it's not going to I'm I'm not going to do it this this time, but well, my next statement was going to be use like use the brand guidelines and make sure or or a PowerPoint template to make just make sure there's a like a title page with the power logo and stuff like that. Isn't it the brand guideline that's already skill? I don't Oh, it is. Yeah, I think so. He put the brand guideline. I have a brand guidelines markdown file. That's a part of the team.

### **02:52:28**

**Taha Raja:** I thought it was saw. Oh, it is. I thought you were talking about your skill. No, no, no. Yes. It's part of the total skill of the It should be part of anything it produces. It should always follow the brand guidelines. Yeah. Okay. So, if I say use the brand guidelines, make sure or just I'm going to just do it. Yeah. See if see what it is. Yeah. It'll be interesting to see. It should because at company level the team uh it did it is still telling me I hit my usage. Do you have to log on and log back in or something? I've never had to do it. So you might have to log out and log back in. I also only gave you like an extra $5 worth of usage. So I don't think you would have burned through it already. I don't think I've sent the call. I've sent anything yet.

### **02:53:28** {#02:53:28}

**Taha Raja:** So guys, it's 11:05. I know you guys have to leave at 12:00 noon, correct? I'm going by what you told me, but yeah. 3:00. Well, if it's 3:00 flight, technically, even if you arrive, I'll drop you guys straight at the terminal. Both of you are at terminal A, right? We're on the same flight. Yeah. But American Airlines. Yes. Yeah. It's terminal A. Um you really don't And both of you have TSA. Yeah. Yeah. You probably need 15 20 minutes to get to your gate. So um and you don't have Right. Nope. Okay. So, yeah. So, technically we could leave here at 12:30 and we would be fine. It'd still give you like an hour plus before your boarding time. Fine by me. Yeah. Grab some just see what the graphic looks like to weird. All right. Everybody in this room should now have also have access to an account with Netswuite next on it.

### **02:54:30**

**Taha Raja:** Oh, all right. Yeah, it's 1 hour 5 minutes to the airport. So, yeah. So, all right. So, I mean, I'm obviously running into limits, but um but I think that's fair. I mean, I'll see what power it generates and go from there. Let's uh do we want to So, let's talk about next steps and what needs to happen, right? So, uh I mean, do we have anything Anything else we have not covered? So, Imran wanted to have some like business building logistics conversation. Let's have that after he gets back. He's got this 104 project 8 project thing that he built that I'm not really sure what it means, but he can explain it. I mean, I can give you the the W is working work hours worked and B is hours build. And on the left side, like there's five and you know, he works works four hours, builds four hours. It's 21 and 21\. But going to AI, if he should he be able to bill the same working two hours and billing five for the same tasks and I think what and the answer was no.

### **02:55:56** {#02:55:56}

**Taha Raja:** You would have to fill that. You you're not you're not not able to do that. And his his question was like how do I get to the 21 hours or roughly the same? And like you told them you you'd be more projects. Yes. that way or the five or greater opportunities within the projects that are split by eight. So like now like this five became a two down here and he can't do this so it becomes this and he can still get to 23 because he has eight projects. Okay. Ultimately I think I mean he'll have more detail. This is but in my in to to Ron's point as well I think it's going to be a combination of more projects and potentially more opportunities because now you have Claude helping you discover things advising the client differently instead of you waiting for the client to even come back to you saying I've got this problem. So yes and and and it may not be like 50/50 coming from new projects versus new opportunities within a project.

### **02:56:56** {#02:56:56}

**Taha Raja:** Yeah. But there should be something. Yeah. And the thing is, if you think about it, from the very time you started working with PowerCloud to now, there's probably clients that are technically still engaged with us, but you have not talked to them for many weeks. could claude with the project concept help you say for even a relatively silent customer as long as we have access and we're still under contract let the AI do some discovery periodically and give you some thoughts it may come back with nothing it may come back with something also we talked about yesterday about new release opportunities new features things AI is changing rapidly using that to suggest something new to the client that they may have not thought about all kinds of things right these are things that you know now as a consultants instead of being reactive I think the more business will come from being proactive right and using AI to assist you in creating opportunities right I mean my entire thinking every day has completely changed. I am constantly sitting in front saying well what could I deploy to give me data that allows me to say this is an opportunity even within the company within FMW within my storage business within my other things that I'm doing even within my photography stuff I'm re having AI analyze old photographs to say how I can reprocess them so that I can sell them and it's amazing all the data which I could not as physically as a human being crunch Now it's able to do that in a short period of time and give me suggestions which in the past

### **02:58:48** {#02:58:48}

**Taha Raja:** I would have never thought of never thought of. And the thing is the more active you become and proactive you become the more results you'll get. I fully suspect there will be the bell curve applies to those people who use the AI this way or not. But to me I genuinely believe that in this a day of AI it's not just about efficiency. It's about opening new doors. So the question ends up being back to you, not me all the time. I would ask you back again. How would you increase your hours with AI? Yeah. What would you do? So I don't want to go too much further than this because this was really his Yeah. Like he wanted to be part of this conversation. So So let's go back to let's go back to next steps. Yes. Um, so first of all, I think we're at the point now where we can roll out, we probably need to roll out Claude to everybody. Like that's our tactical black and white.

### **02:59:52** {#02:59:52}

**Taha Raja:** Like Ron's here in the room with us. He's been through this all week. We're asking an Google to do a project with this. Right now there's only two people left. So we we need to just roll this out. Um we then need to take the recordings basically and of this week of this week the existing project maybe some of the resulting documents and files and run an analysis on them. I think we got to separate it, claw it into a different working group and say, "Hey, listen to all the feedback. Look at all the documents. Look at all of your skills and different instructions. What are we missing? What are we not missing? Um, are you able to do that? Are you able to do that in like for example the assessments folder but a different subfolder so that you can so you don't have to like move all the crap that we were doing because all that's basically what what we're doing here right? Yeah I don't I think I could do it in that folder like rather than having to like start fresh and like hey grab all these files and move them again.

### **03:01:04** {#03:01:04}

**Taha Raja:** Yeah I think we could do that. Um, so that's one analysis that I think can give our current tool set a little bit better, a little bit closer to what we're trying to get to. Um, I think on me is to figure out exactly what the folder structure needs to look like. Can I I think we decided we can use the project folder on some level, but do we need to move the source documents? Do we not need to move them? Open question there. um then I think we need to use and iterate. I think we need to start making use of this. So in the use part I would say we need to figure out a way to formally educate announce get everybody on the same page. That's a good point, right? Because if we just roll it out with documentation, prime example, if the documentation, he ran a roadblock and now he's not doing anything until I get with it. Yeah. So, I'd like to get everybody on on a single call and say, "Everybody get on the computer. Here's the steps you need to take to get it all ready to go." Yep.

### **03:02:19** {#03:02:19}

**Taha Raja:** I think that makes sense. Um I'm curious to get the feedback of what where he gets stuck once you get Well, you know, it the thing is it's if you've not been using AI, I can see how those kind of instructions talk now can kind of confuse you. To me, it's like, okay, this is obvious. Here's how you answer it. But, right, I can see from his perspective, if if he has never done it, it probably said, well, I don't know what this means. Yeah. And I think we're going to have varying um across team members. And this is maybe even more uh prominent than like Shirley and Maria as an example. So like Maria last week goes, "So what is MCP and what does that do?" Yeah. And I said, "Well, why don't we jump on a session this afternoon?" And we literally jumped on a session. And I gave her examples even within our connection to show her the power of it. Yeah. I think I think we need we need to baseline everybody to what we're our expectation is of people operating in the cloud team environment.

### **03:03:18** {#03:03:18}

**Taha Raja:** Go through what does the team environment afford? Yes. What are your expectations? We need to get everybody on the same page. Yeah. and and then formally announce that this is a required tool for you to use in your projects. I think if we can formalize that process, uh that's a meeting we probably need to have in a short order. Uh you know, and then that way everybody understands what's need and I think part of that needs to be limited to some of the tools we we can talk about it internally, Mike, as to what do we want people to roll out with right now. I don't think we need to roll out the implementations piece yet, but the assessment piece. Assessment piece for sure, the executive summary, how does projects work with the team environment, what are some of the benefits of using that, what do skills mean, how what skills are currently already present, etc., etc. Okay. Yeah. I I will tell you in my opinion because again there's theory and there's practical application um if if we have team members that are not on claude and we're going to do that demo and then they're not on clawed then that's a lost opportunity of letting them immediately jump in and No, that's why he said he's going to give access to talking about the order of operations.

### **03:04:34**

**Taha Raja:** Yeah. Yeah. Yeah. That that we're going to do it like today or probably Monday at the latest we'll get it done. But I think make sure that I think that meeting needs to occur sooner than later. Uh Mike. Okay. Uh to get everybody on the same page because even when you roll out the invites such as again as an example here today, he really didn't know what to do. Yeah. You know, and there is some quirks, right? I mean like if you have your personal cloud account that you use borrow cloud on versus maybe did something else. There's all these little quirks that still exist. Yeah. Yeah. I went through that too because I had a lot of s\*\*\* in the in the cloud cloud at PowerCloud and I was like, damn, I want to lose all that and how do I But you merged it like you can't merge cla power cloud into the into my personal. Can I Well, is your personal under power cloud?

### **03:05:27**

**Taha Raja:** So Justin at PowerCloud is under power cloud. My personal is not. Yeah. So I had so I think I did merge my personal when I created the the the Power Cloud team one though because I had a I had an individual login with Justin at PowerCloud that I that I might have paid like whatever 20 bucks for you that I merged in but I don't think but if you have a different email yeah I don't even think I logged in with my Gmail. So that's the the the hiccup with the way the merging works is if you had a personal account under the same dom domain, you can merge it. But if you had it under a different domain, you can't. Oh, wait. Maybe that does mean you can merge cla power cloud into Justin at PowerCloud because it's that same domain. Well, yeah. I mean, but I would get all beves and all you guys, too, which is fine. Fine. We probably need to do that, but we'll let Mike and Besh handle that part.

### **03:06:20**

**Taha Raja:** Yeah. At this point, I don't think it matters. I mean, I can go back to it if I really needed to. Yeah. As long as you're not going to deactivate. Yeah. I mean like I I have I have a even a further challenge because FMW has a team account. I so I actually have dual login and I have I switch around between the login. Yeah. But that's no different than if I have to switch around my emails anyway. So there's the same difference. Yeah. So I'm I'm comfortable with that. But you know those things may be things we need to talk about with all team members because certain team members may have another different domain or whatever. Right. I mean it's very important. It's a practical thing that we need to bring to the table and make sure they clearly understand I think important um to stress to the everybody and I think you mentioned it already just a mentality thing and some I'll be I'll admit I use it a lot but there are also happened yesterday I was talk just talking to Mike like how do I how do I train how do I give my wife training to use basic computer skills to get a regular job because like she could she could go into customer service at this company she works at she has no effing clue how to use any of this stuff.

### **03:07:25** {#03:07:25}

**Taha Raja:** And immediately he was like I'd asked Claude to put up the training thing together and I was like well I don't know why I didn't think of that but yeah it's just I it's probably a mentality thing and it's easy to be because that's how we've always lived but I think it's important to stress silly work things but hey like somebody sends you an email and or asks for a report this that whatever the task is just start there. Yeah. So one one of the dangers one of the dangers of AI that I'm seeing from a company perspective and Mike we need to figure out make sure we kind of reinforce that is that when when you have an AI agent that helps you do many things you start operating in a silo more and your collaboration effort with your colleagues and other team members actually reduces. Yeah. And you because you feel like you can get it done yourself anyway. But the lack of collaboration and communication results and manifests into bigger problems. Because then your colleague doesn't know what happened.

### **03:08:23** {#03:08:23}

**Taha Raja:** Yes. And when they interact, they miss that opportunity. So we have to solve that problem. And by the way, communication is the boon of problems 80% of the time. Well, like we saw one earlier like the thing I did for GW. Nobody else knows that I did that. wasn't and I don't mean that to be a bad thing like sound bad but that's a potential tool or like I I was able to put that together and it uses a couple things that I don't think we've used other places like jQuery data tables I'm not even talking about that I'm talking about even just more fundamentally Toy. consequential conversations or or things you do at the client side without even letting your colleague know who's your who's your who's your colleague in in their same project. Yeah. Yeah. Like I I might is the project collaboration tool and sharing of the project a critical element of how we deal with clients and what does that mean? Because if we are continuously going to put two engineers in every project, but if you do something and your colleague, Maria, Charlene, whoever doesn't know what happens.

### **03:09:39** {#03:09:39}

**Taha Raja:** Yeah. It's got to make it back to that to that that project management. Yeah. and and and a communication way for her to be fully aware so that when she's using AI to help her in that same project, that AI is leveraging that same information, understands what Justin has done where you may not have explicitly communicated it, but the commonality of that knowledge base helps her make sure she understands what you did and what she did. Yeah. So, this is where the folder structure helps, right? Because if we are using claw to brainstorm and make decisions, even if we're just confirming that we executed things, it's going to if that gets up that needs to be up, make sure that gets updated in the knowledge base of the like the evidence or context. Yeah. Like something in there. Then anybody else continuing a conversation in that same folder will be talking to a being that understands it. I think we need to iterate through this things. Yeah.

### **03:10:42**

**Taha Raja:** Then have this launch meeting and then start working through this process. We I don't want to roll this out and and then people are kind of halfassing their way because that's going to provide I mean this much preparation I think we need. I do I am anxious to get this out there as soon as possible because I think we'll get more data from just usage but if you don't even know how to start the car there's no point in driving it why put in the driveway you definitely want to make sure again if you if you use this overall header how do we equip people to be successful is well what are the requirements for them to be successful what what are the what are the key elements there for them to get started and obviously all the work that you're already doing to put all the to to aggregate all this information and then create these these initial components of this to work you from the SDFs to uh projects to prompts or what you know all these different things um and then making sure people have have their cloud accounts and whatever it's like what are those minimum bars where people can actually get started and it's realistic to expect they can get moving and jump into a practical application and be like I got So I think to so couple things for us to iterate on next week.

### **03:12:00** {#03:12:00}

**Taha Raja:** I know you're going to kind of think continue to try the pulling forward thing. Yeah. Or I'd love you to find a place for yourself to jump in and start using this. Yeah. Yeah. Yeah. So, what we're ultimately driving towards is I think I just did one on WMS for Bomb Party. So, I'd love to I'd love to run all those notes through that. Yeah. And and see what it does with that. So, I'd love to give us a little bit of week to iterate through some of these things and get this group back together on a virtual call. Yeah. Um to kind of see where we've landed on some of these decisions, some of these thoughts, work through some of these problems um and see what we can do um see if we can answer these questions. If we can, then we schedule the roll out. Once we schedule the roll out, once we get the roll out done, we can then maybe turn some of our attention to our agentic engineer and letting him take a pass through it first and then having him move into Yeah.

### **03:13:07** {#03:13:07}

**Taha Raja:** the tool that Yeah. So, let's let's uh let's put something together. I I'd like to put at least a placeholder meeting together right now. Yep. Let's put it in blocked out our calendars because we try to do it last minute. We won't have time slots. Yeah. So, let's put something on the calendar. Yeah. And I' I've sent you guys an email and just topics that are bullet points. A lot of these we already discussed in detail on here, but just bullet points of my observations for the week. Uh, as well as some things we may had not have dove into. One topic I do want to bring up at a high level because this really gets more into the it gets more into the human element is that I know personally but also I know you guys experience it from the power cloud management side. I know from fellow colleagues, I know from people who are in consulting outside of power clouds that there is a lot of anxiety and this is really normal during times of immense change, right?

### **03:14:06** {#03:14:06}

**Taha Raja:** And you see, you know, tons of layoffs happening in all these different count it's all in the news. So, you know, it's not like it's any secret, right? And so, I think there's a there's change always brings about anxiety. Yeah. And uh and so I think even some of the things you guys talked about on the forefront of this and I don't want to beat this to you know beat a dead horse where we're going overboard of talking about it but um without information people create their own and usually it's wrong because it's just based on assumption and if you add fear to that then it just really gets you know crazy. Um and so I think I think uh you know you guys in in day one talking about uh how we adapt and how we flourish in this environment. That's is really the goal of all this. Yeah. Uh which is why we're so heavily embracing this. Uh I think that helps it helped me and I think it would help across the group and maybe it even helps reinforce it for y'all too because you're human beings too.

### **03:15:14**

**Taha Raja:** Yeah. I mean I'm sure that you guys have already had in your own personal needs many many oh s\*\*\* conversations. Yes, we did because it is scary s\*\*\*. I know. And it's equal parts AI and the and the the the emergence of where it is right now is equal parts fascinating, astonishing, exciting, and terrifying. Yeah. You know, and some of it not even terrifying from the, you know, the the apocalyptic end of the world stuff. But some of it even is the is this bubble going to burst? As we talked about the financial realities of you can't perpetually lose billions of dollars and stay in business. Yeah. At some point there has to be a what does that look like and how does it impact us? But without you know killing yourself with fear of well we can't just stay here in the headlines. Yeah. Yeah. I think that'll be an important part of this and we we've certainly we did a lot of that with the development team when we said you've got to come online with this.

### **03:16:18**

**Taha Raja:** I'm sure double terror I think they thought for sure they were going to get away because now ising everything and so yeah so my point is that you say nothing then all people are left very good points wants to talk money so let's just so look you are out the week of the 10th like you're out. Yeah, I'm traveling next week, but I'll be highly available. Even the week I'm there, I'm I'm going to be Okay. Because I was I wanted to put a meeting on I'll be there. Okay. I wanted to give us time. Um like next Friday wouldn't would probably not. I'm next Friday. I'm on my way to New York for a wedding. Um so I'm looking at the week after. I just want to follow or follow up. Yes. So, we we we're doing kind of a two-step process. We're going to do one follow-up of this team to come up with uh so first and foremost, Mike and I, mainly Mike, is going to make sure everybody gets provisioned and clawed and we may want to do a small meeting next week just to get everybody provisioned.

### **03:17:36** {#03:17:36}

**Taha Raja:** Yeah. So I think a provisioning meeting with the team members that do not have cloud yet where you just walk them through saying here's how you join it. Here's how you merge if you had it in the same domain. Yeah. And educate them that if it's not in the same domain it'll have to be kept separate. Yes. Right. So that way they're just familiar with the interface. Once that is done, This team needs to reconvene. That's going to happen early next week or the week after rather. Right. So, uh I put it on for Wednesday the 12th. So, you got about a week and a half. Week and a half. And the purpose of that will be to kind of we'll do synthesizing of this meeting notes. We'll have some plans together of what the next steps need to be with the ultimate goal being how to get everybody to start using some of the processes that we've defined like for example using the executive summary using the assessment folder kind of creating that process.

### **03:18:32** {#03:18:32}

**Taha Raja:** I don't think we're there yet to start deploying agents to do stuff yet. M that might be the third step uh because the development team is going to have to get involved and we going to start sharing with the development team of some of the stuff. So there are multiple steps that going to happen. Some of this will be iteratively improving, right? I mean we're going to to a certain degree jump on the deep end of the pool to start swimming. You know what I'm saying? Because I don't want you you can't I don't want to be par paralyzed by just starting to plan plan. only after doing you'll get some of the data back to say yeah this is not working or this is working. Yeah. So some of it will be a combination of the same so there will be a followup. Okay. So and he's putting together meetings right now to put it on our calendars. Yes. Yes. Okay. Um you wanted to talk about money so start talking.

### **03:19:32** {#03:19:32}

**Taha Raja:** I definitely threw a lid of that. Didn't money. Not really, but well, I mean, hey, the rest of the world working for free apparently. So, I put it a new discovery that I getting paid out. So, I think this goes back to the very first day I mentioned your thought, right? Everything eventually has to make a business sense. we just get too deep into doing something without even realizing what the end goal is, right? Um like how should all of this make business sense because I mean don't put it on me. I mean it's not making money for I don't make money if he doesn't make money. That's no that's true. This benefits everybody in the room and I've been hearing about this you mentioned it again um the customers keep asking time material it's not going to work it's not going to work right. So when I at least when I started two or three years ago this was the model right I have four each has four or five project whatever project it is you work five hours you build five hours maybe more procedure I'm depending on but you are actually spending time clicking the buttons up CSV upload save JS customization right then we moved on came AI those that was a transformational change is what I'm saying incremental versus transformational right yeah spending eight hours creating from my notes a rapid assessment for

### **03:20:57**

**Taha Raja:** lowle Horses. is using a transcript and spending 2 hours is a transformation change in my opinion. Yeah, it is absolutely the quality time and uh ease of it. So we came to this part when the same amount of work was being done in two hours but we can still charge five hours or whatever numbers because customers don't know about it or haven't haven't already. I think we are in this stage but I was talking to Justin now customers also know about this too. That's right. Every six months we It's going to get worse. Some some more than others like some more than others. Some way more than others. Barbell is three years ago. But we have to assume that in the very short Yeah. This will be where that's what I've been hearing from you my customers asking to use AI, right? It's not like a hidden tool under my toolkit. Yeah. Like I think I think good ex I probably told this anecdote at spring training but uh one of the big four accounting firms I forget who it was had this like big announcement that hey we're now able to do audits in x amount of time and they were so proud of it and at their next quarterly meeting they basically came in tears because it's like oh our customers read that announcement and now they're not willing to pay.

### **03:22:18**

**Taha Raja:** Oh I think I think audits anymore. Yeah, deoid. You said it was the Lloyd. So, so, so the next stage is going to be two and two and two and two. So, the total will not make sense, right? Yeah. So, what happens next? One option we talked about was you manage more projects, right? Then you two is two, but at least now instead of four, you have eight. So, the total still turns out to be the same because you're spending same amount of hours, charging same amount of hours, being more efficient. But this requires more projects or more customers which I don't know how easy. I'm sure it's not easy to get. Or the other question was which Ron brought up and we talked about the doors which we don't know yet. It doesn't have to be projects. It could be some new type of work within the same four projects. I don't know. Or could be different type of project.

### **03:23:06**

**Taha Raja:** It doesn't have to be or right. Yeah. Yeah. Maybe the doors we don't know exactly. One thing we don't know what we don't know. Yeah. because whatever work we did in last couple of days in my personal reading and opinion I don't think it's going to change any significant amount of maybe yesterday we did something interesting deploying things yeah uh for the rapid assessment part which we spend the first two days I don't think it's going to save us any more significant amount of time no it will help us compared to what we've been doing the last couple of months yeah not compar for 9 months but that's because you've already were down that path so to speak correctly things are changing every six months right whatever we decide and we come up six months in Vietnam we'll be talking something completely different yeah uh so yeah it will bring quality it will bring the detail analysis to MCP we can before we kind of kick off call and all. Yeah. But if it's a 20our assessment or what 20our fix bucket assessment, I don't think we're going to complete things in like four hours now.

### **03:24:08** {#03:24:08}

**Taha Raja:** It's still going to take I don't know 20 maybe 18 or 25\. So I don't think the efficiency is going to be there but the quality um consistency standardization might be there and the density of information will increase. Yes. Yeah. Yes. So the factors I was just putting into that but in order to achieve that you're going to use so many tokens which we were not using previously. So there's a cost to it. Optics will improve because now customers are okay this is good quality stuff like before the kickoff call they're asking you questions which nobody even asked because we did the Yes. So that's the optics the AI part the impression part but again it's not direct monetization maybe over period of time or something. It builds trust. It builds trust which is very important. It's a strategic business level really. I cannot think of it. I can understand it. Yeah. But uh as a consulting level and then you know embrace AI and new doors some of the open topics but eventually the goal has to be these three right either it increases revenue for the company decreases cost which kind of increases your margin and then saves time so you can do more.

### **03:25:10** {#03:25:10}

**Taha Raja:** Well, and the other thing that I mentioned when you had stepped away is that not only more projects, but I'm going to throw the question back to you. What can you do with AI to discover more opportunities within the project which you Yeah. Yeah. We talked about briefly, but I think I I elaborated some more when you had stepped away. I think that falls into new doors, too. Yeah. New doors. Exactly. So, you know, all of us have experienced clients that kind of go dormant. We're still technically engaged. I'll give you an example. ACL, right? You know, they're likely engaging. I was even surprised if they're still working with us. I did not know this, which I should have not, but you know, could you, if ACL allows you to deploy the MCP, could you do more proactive research on their accounts? Look at what they're doing and potentially offer things in your next calls. Maybe you offer them three or four things.

### **03:26:14**

**Taha Raja:** And if even if one or two yields more hours of work for you, that's opportunities that AI has afforded you that in the past has not. And I think having having an entire lifetime of transcripts from the calls also goes into that like, hey, what they talked about in the past or you now know what they're trying to do and a full understanding of all the good, bad, and indifferent. Where are some improvements we could suggest as a phase? This this is important feedback that we need from you. Food for thought, not necessarily answers today. What do we build into this portal or this agentic work that allows you to manage these clients in a more proactive manner because the first time we're able to be more proactive with good information given to you in digestible formats that you can take action on. You have data today, you're not able to take action on it because it's almost impossible to digest that data and create actionable tasks. IT. Yeah. Now you have something that can help you do that on a regular basis because I can guarantee you right now you might say you have four projects but you really have eight to 10\. The other four to five six are probably dormant.

### **03:27:37** {#03:27:37}

**Taha Raja:** Yeah. Yeah. Yeah. Yeah. So you already have those clients because I can tell you Anderson Frank keeps on telling us you guys have 50 clients that you guys are operating but your hours don't reflect the number of clients that you're operating. That's their complaint because they make money on the island same as yours till now and now yeah maybe there is a door so that's what I'm saying that might be a potential door I I want you to guys to doodle and contemplate on it and saying how do we do use that because the thing is and and guys I will tell you that it is normal for consultants at our level to operate on a very task level. Yeah. where the company gives you a project, you work on it and then if they go dormant, you move on to the next one. Those days are gone, right? You have to elevate yourself to say how do you become an adviser, consultant to that client. And part of that is being able to because I can tell you even though the client has access to the AI, you are dedicated to analyzing their system, they are dedicated to operating their business.

### **03:28:44**

**Taha Raja:** Yeah. So they will always need you to help them even even if you're helping them using their own AI. It's almost like they need that help kind of a third person to look at this system and tell them hey because they're busy just getting their own business to run. Yeah. And that's and what they're great at is their products they make their products they sell. That's what we see this over and over and over again. The lack of bandwidth in the human mind to understand huge amounts of data and make good statistical decision is a human weakness that AI cannot solve. Okay. So you using the AI to help them and create and more efficiencies for them will be the one of the doors that I can think of right now. And there will be few more I'm sure. That's a good point because like just like we talked about how AI cannot match your quantum processing in your brain. Yeah. You're never going to be able to get off like a limited data set.

### **03:29:48** {#03:29:48}

**Taha Raja:** It doesn't care how big the data set. That's right. It's like and it can it can crunch through it like no. It never gets tired. It doesn't need a smoke break. Yeah. Just keeps on going. This tree was the O heard from because I've asked you this at least I've asked you and Steve this question. I think I've asked you Mike also. Why are we only restricted to Netswuite and you you said we looked into it and did not work out for whatever reasons. But I think now because I remember when the technology uh came in or technology kind of become cool every company became a technology company. I used to work for oil and gas Baker Hughes. they started calling themselves a technology or yes because that was the word to use right so I think it's not unfair for us to I think you also said yes to it some kind of being an AI consultant and just consultant that's why we're becoming trying to become an entropic partner partner right and and even are we're like yeah we are conditional right now but we need also your help in those certifications because to increase credibility to make sure that we keep our partnership, we're all going to have to probably certify at some level, right?

### **03:31:02**

**Taha Raja:** So part of that it needs to be part of your equation. If you recall, ERP certification was important. Now AI certification is going to become important, right? Yeah. Because remember elevating your understanding of so there's two types of AI users right now that you need to think about right an AI user of a common man who goes into the interface that all of us are using and ask question and it spits out an answer then there is a person who can understand it from a matrix standpoint right understands how it operates in the back end understands the data structure understands what token is not just some number that flips in front of you on a website understands cost models understands what is the best way to optimize it for your business need that's going to be the AI consultant and if you're not able to answer those questions we cannot become an AI consulting company because how to use AI AI itself will answer that question you know for that for that user so maybe another task I can I probably should get you guys into the pod portal, like the partner portal, so that you can access their education.

### **03:32:18** {#03:32:18}

**Taha Raja:** Yeah, that needs to be for everybody. That needs to be for everybody. That's that was one of the bullet points I sent was continuing education. How do we ramp up? How do we most of the cloud stuff is public, but we we actually as partners do have access to some partner only educational stuff. I think the architect exam is a bar that is probably gonna stay above you most of you guys. That is a hard pass. Like I I don't have any intention of being able to pass the architect. You two guys are saying that's hard as s\*\*\*. I'm like was like hard do it. Yeah, you should. Yeah. And I I would include outside the box because Oh, you have more relevant YouTube channels. Like sometimes that stuff is great if you find a really great content creator. So I would be careful with AI content creators. Well, I'd rather you guys bet that. Yeah. Like I I get a lot of them on my socials and stuff, but honestly, I think most of them are out of date already.

### **03:33:18**

**Taha Raja:** Like they're making assumptions that I just saw Boris Churnney said last night like this idea of being obsessed with you like prompt engineering like nonsense. It's like it just you're like you shouldn't be paying somebody to be a prompt engineer. Like that's not a real job. Yeah. I've already seen a lot of conflict. Well, that's true. If the tokens were free and Yeah. He's not paying for it to That's the problem. There you go. And that's what I'm saying. It's about to change. So, uh, so I like for a training purpos I'll get you guys in there. Yep. Because there is some good stuff in there. And honestly, even the short videos on the really aggressive stuff like the architect stuff actually isn't bad to watch. You'll hit points where you're like, "This is a fast forward, but there's some nuggets there." But like listening to like the first section of each topic when they kind of explain how the architecture works is interesting and then they go into you know exactly what the comma structure is in this post and you don't really need to know about that.

### **03:34:28**

**Taha Raja:** So I'll just give you an analogy. I think it'll hit home. When a customer uses Netswuite, what do they know about how Netswuite works? what they see. What they see. What do you know compared to them? How it works. Now answer that question about AI. I'm the customer. That's right. At this point, we're just the customer. Yeah. You've got to in order to become an AI engineer, you need to know as much about AI, right? So that's the the key. Now AI itself will assist you in that pro process. But keep in mind these are private for-profit companies. So you have to keep that in mind just like how we keep in mind about Oracle. We badmouth Oracle about all that s\*\*\* they're selling because of this. Well, we should be saying about that entropic as well, right? And then giving advice to our clients saying, well, we don't want you to use this AI model.

### **03:35:31** {#03:35:31}

**Taha Raja:** We want to use this AI model which we can synthesize into a portal for you for AI work. And I think the model switching is like yes going to be one of the most important things. Like you don't need Fable to write a PDF. Yes. Like you can switch. You can have something that toggles to like the lowest like once the MD file is prepared with all the the text in it like that, you go to the oldest model in the world to put that into a PDF file. Yes. And I'm starting to do that and I'm seeing what the differences are and that's my first foray in just optimizing AI because once it becomes extremely expensive where it's 13.5 kilowatts per hour, you're going to dial down that thermostat because you don't want a $500 bill, you want a $300 bill. Yeah. Yeah. And like so for you guys I think understanding that that is an option and that is a strategy is what's there for our AI engineer he'll be the one who has to actually implement that vision to we to where we don't if if there's a portal we don't have to worry about that the it knows where and I'm actually thinking if we're building something for a customer you have to put the thought into not Maybe literally which model but the good better best like

### **03:36:55**

**Taha Raja:** which at what point should it hand off? So better answer for you from my perspective is yes for the portal you may not have to worry about that. Mhm. But if you're going to become an AI advisor Oh you do? Yeah. Then you will have to know. I mean that's why I ran into the usage last night because I we we bumped it to Fable. We didn't even bump it to Fable. We bumped it to opus five just to like to do like a deeper dive into accounting practices and s\*\*\*. I should have immediately backed it back down and I didn't. I only ran a couple commands after that, but it was like boom, you're done. Well, even within each model there is mass and all these. I had it on high and so I don't know what what that you know and and they purposely won't help you manage that right now. Oh, because it cost them money. So I was going to say in the course that we all went through they did actually talk about lowering and like using no they did but there is no way to you know semi-automate that where there's some feedback like you know you look at these token counts unless you have a monitor up and you're constantly looking at how this usage is going to be and then they also say well you know and they don't even know right sometimes like what which task really deserves which level So I almost have to experiment what whatever service level we're on right now

### **03:38:17** {#03:38:17}

**Taha Raja:** like my account's account Ron's account like how many tokens do we get? Is there a number? There is. But is that meaningful to you? Like no that's where I was going. So like I don't even know what it is and they don't really even publish it because they publish it in proportion, right? Like this account gets x% more tokens than this account. Oh yeah. Because the truth is like nobody really knows. Yeah. It's a little bit of a black box, but again, I think by design. Yeah, of course it's by design. But again, for us as AI advisors, we'll have to figure out how to crack that black box or figure out a way. Yeah, likeable. Yeah, at least you do not have unlimited. Nobody has unlimited access to Fable. Um Fable Fable is gonna have very limited Well, until they come up with something better and then maybe it falls down. But like the intention with Babel is that for the most part you have to pay it's going to be meter.

### **03:39:14** {#03:39:14}

**Taha Raja:** You're not going to they're not really even giving you very much in your except that's what that's why we didn't use it yesterday is special credits. So the so the other models all use more or less tokens. Fable is almost on its own meter, right? So like if you have a thousand tokens, Opus may use 500 and Sonnet may use 450\. Fable doesn't even pull from that pool. Fable has its own pool. Yeah. Uh before we go, uh you said there would be a task for us to log these hours under. Um I don't see one. I might be looking at the wrong customer project. Okay. I assumed it was PC internal hours. I don't know. I don't even remember saying that. So, I'll put it on the chat. I'll put it in the chat. Okay. Yeah. Um Chris would have it up today, but I I don't know even know what customer or project to use. I tried using Power Pub.

### **03:40:15**

**Taha Raja:** I don't have access to any tasks. The PC internal hours doesn't have a task for this. Let me see where he put I mean, I would wait till later, but Steve sent a message to make sure we get hours in by the end of the day, so I'm not sure. We have this rule for the day, right? Until 5\. Uh, I think so. I'll leave in a bit. I'm gonna When time comes back in, I'm Yeah, that's fine. I I didn't mean to ask. You should stay in for a bit. I was waiting for I'll finish off all the work like putting in hours and Oh, yeah. I have to send a couple of emails. Not a bad idea. I should probably just do that now. Yeah. And also I have ordered food. Oh, you ordered in August to take to Austin. No, I ordered Nihari. Oh, is that your stuff you're picking up on the weather or you or is it coming here?

### **03:41:05**

**Taha Raja:** Coming here, man. Going was too much work driving. What is is that the place you were getting biryani from? Nihari. Remember, what's what is biryani? Like you have never had biryani? No, I have. I have and I like it. I just but I have no I couldn't explain it. If you ask me to explain it or it's a rice. How do you make it? I also don't know how to make it but it's a rice and chicken or rice and whatever meat you're using. Yeah. You cook that meat in certain spices. Mhm. You cook rice separately and then you mix both. Yeah. And that's it. Where are you getting it from? Usher. Usher's kitchen. Oh, okay. Yeah. Yesterday we were buy that site but said not don't get right now. Now you have to store it which made sense. We would have Right.

### **03:41:50**

**Taha Raja:** Right. Right. You put it You could put it I could have Yeah, I should have noticed. But it's probably it's definitely better than Oh, he's not wrong. It's going to be better today. I know Phoenicia further in too. They've got an incredible store and they've got an incred incredible counter where you can get all kinds of great stuff. Phoenicia is also pretty good. Yeah. I mean, Houston food is Yeah. You get whatever you want to eat. Yeah. Yeah. It's pretty diversified crowd. We don't Yeah. We don't have a like like Indian food. I kind of got to go and it's really kind of a chain. It's called naan. Okay. And but it's it's far from me. Like it would take me like 25 minutes to get there and it's like I'm not doing that. But there's a food truck that comes around every once in a while and they're really good.

### **03:42:33**

**Taha Raja:** So how big is what's the right Indian Pakistani population around South Carolina? Right. It's probably not that much. Not that much. No. No. Not I mean, maybe in Charleston. This probably more in downtown Charleston for sure, but I'm not driving 45 minutes to downtown Charleston fighting traffic to get food. It's always unless I go out for dinner for that night. It always like the cuisine you get in a local region is always dependent upon where is there a large immigrant community. Yeah. Because that's what the source. Like when I was in McGomery, Alabama and I just asked what are good foods locally in McGomery, Alabama, and one of the surprises like there's an incredible Korean food scene because of because there's a Hyundai plant that opened 13 years ago. And so then all these great Korean restaurants started popping up to feed all of these, you know, Korean transplants, like Chinese food. I cannot get Chinese I I get it because I just suffer. But if I order Chinese food, I'm like, this f\*\*\*\*\*\* sucks.

### **03:43:37** {#03:43:37}

**Taha Raja:** The fried rice is terrible. Well, Houston's such an incredibly international city that you get like like but northeast Chinese food is like better. Yeah, we have like in in the northeast better Chinese food in China like Instagram south. Um there's a lot actually to what you just said there's a lot of um I guess I would call it or like we call it DG is like the whatever but it's all it was the slaves. I think there's so many slaves in that area and uh so there's you know food related to that I'll wrap up some work I go for and then I'll I've also I have one final thought on my side when we talked about dormant accounts to me one one possible opportunity to revive some of those is offering to help them set up MCP and and selling them on the value of MCP because most of the people that I've talked to that aren't aware of it at all, it's a real eye opener as soon as they start using it. Okay. And um and I some of these conversations I've had with people have been very dynamic. I think one thing that might be helpful is that as you've already seen Ron, we

### **Transcription ended after 03:46:05**

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*