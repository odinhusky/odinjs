## Dec 2021 (v5.3)

#### Welcome to the December 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 1. Add schedule：
> - Add new version pattern
> - Be able to view user schedule list
> - Be able to modify schedule
> - Different mode: job or resource
> 2. Job submission：
> - Add jupyter password
> 3. Job management：
> - Turn on warning of closing web SSH
> 4. User management:
> - Add batch importing of statistic information
> 
>  ✅ **Bug Fix** 🐛 
> 
> 1. Job submission：
> - Resource unit, loading digit error during initialization
> - Modify storage block name
> - Fix docker image field error of importing template
> - Fix calculation of resource unit in task roles
> - Fix error of clear filtering users during template selection 
> - Fix init user virtual group list error
> - Skip environment variables check when it is empty
> 2. Resource management：
> - Fix add new resource calculation bug
> 3. Template management：
> - Fix loading docker image bug
> - Fix modifying template bug
> 4. Job management：
> - Fix GPU usage time calculation bug
> 5. Centralized storage：
> - Fix uploading data position bug
> 6. Add schedule：
> - Not recording key words
> 7. Personal setting：
> - Modify password field height
> - Group->My group, Username->Name
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Add schedule：
> - Layout optimization, center and space
> - Support XDFS
> 2. Job submission：
> - Modify layout of storage setting block
> - Modify layout of environment variables block
> 3. Report analysis：
> - Modify pattern of usage time tooltip

## Nov 2021 (v5.2)

#### Welcome to the November 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Job submission：
> - Notice download process through job event
> - Be able to store and apply template
> 2. Container SSH：
> - Jump server：
>   - Be able to connect to the container through master node
>   - private key can be download by browser
> 3. Outside network connection：
> - Be capable of authentication
> 4. High performance storage：
> - Add high performance storage mode
> 5. Centralized storage：
> - Be able to view link under the folder
> 6. Centralized storage management：
> - Add option of modifying storage size
> 7. Group management：
> - Group leader can not remove himself
> - Auto apply virtual group list to new members
> - Administrator can add members without their permission
> 8. Template management：
> - New version of the template operations
> 
>  ✅ **Bug Fix** 🐛 
> 
> 1. Home：
> - Fast submission, mouse hovered shadow should be circle corners
> 2. Job submission：
> - Notice resources after resource selection
> - Preview not display disk quota
> 3. Job management：
> - Applying filter problem
> 4. Resource management：
> - Input unit can not exceed max number
> - Add cluster name
> 5. Centralized storage：
> - Progress bar disappear when uploading files
> - Be able to input name when uploading images
> 6. Centralized storage management：
> - Add NFS prohibiting underlines or blank
> - Setting public mode, user can only read files
> 7. Personal info：
> - Personal setting, name->username
> - User who has not been approved, group page will be hidden
> 8. Report analysis：
> - Modify calendar format
> - Height between button and dropdown are not the same
> - Memory unit MB to GB
> 9. Login log：
> - Modify calendar format
> - Each page ? rows, (1-nth row) of (n)
> ⏩ **Function Optimization** 🚀
> 
> 1. SideBar：
> - Unify icon size and alignment
> - Reduce the size of width
> - Accelerate click and drop down speed
> 2. Personal info：
> - Display "no limit" if resource is no limit instead of blank

## Oct 2021 (v5.1)

#### Welcome to the October 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Normal user, display name first, otherwise display username
> 2. Job submission：
> - Input unit can not exceed its maximum
> - Preview job submission, if using pinned units, the shm size will be half of the memory size
> - Display used resources, under resources selection
> 3. Job management：
> - Add checking all log mode, under the stderr
> 4. User management：
> - Import template
> - Add user name field, align pattern same as other fields
> 
>  ✅ **Bug Fix** 🐛 
> 
> 1. Home：
> - Normal user：
>   - Running job should be displayed in first six jobs
>   - Running job corner should be circle
> - Administrator：
>   - Cluster status, display resource pool first, meaning total cluster usage status
>   - GPU allocation should display not allocated status in circle
>   - Usage of this week is abnormal
> 2. Job submission：
> - Default taskrole remain lower case, prohibit user change it to upper case or under lines
> - Port number, limit in 1-100
> - Check environment variables key, it should not be just a number
> 3. Job management：
> - Failed error messages, same as older version
> - Delete job
> - Inner page, GPU column, display GPU usage number
> 4. Web SSH：
> - Copy text and paste to clipboard, text will be twice
> - SSH info update to container information
> - Environment variables not been imported to container
> - Close Web SSH connection should ask user whether to close or not

## Sep 2021 (v5.0)

#### Welcome to the September 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Separate administrator and user view
> - Optimize layout and support resolution independently
> - Online people number
> - Usage statistic
> 2. Job submission：
> - Submit by sku type
> 3. Job management：
> - Add job event
> - Add other logs
> - Show more about application summary
> 4. Group management：
> - Member join auto add cluster list(removed when leaved)
> - Be able to set user quota for group membership
> 5. Resource management：
> - Be able to set user quota for cluster membership
> 6. Cluster management：
> - Be able to set user quota for cluster membership
> 7. System setting：
> - Be able to set user quota for system membership
> 
> ⏩ **Function Optimization** 🚀
>  
> 1. Job submission：
> - Optimize page loading speed
> 2. Job management：
> - Optimize job clone performance, never open new page again
> 3. User management：
> - Simplify add user way, separate user quota and storage config
> - Modify batch input for support of multilingual
> 4. Storage management：
> - Speed up local read/write speed
> - Add cache to accelerate data transmission between different nodes
> 5. Key management：
> - Cluster binding to one node
> 6. All pages：
> - Interface optimization and upgrade

## May 2021 (v4.7)

#### Welcome to the May 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Image management：
> - Be able to delete multiple repository and projects and screen will auto refresh after that
> - Server debug alert
> - Add guest authority
> - Be able to download image
> 
> ✅ **Bug Fix** 🐛 
> 
> 1. Home：
> - Fix Firefox browser problem
> 2. Job management：
> - Job which is stopped could not use VNC、Jupyter、TensorBoard
> - Fix not running job can be stopped
> - Container shutdown by memory pressure problems
> 
> ⏩ **Function Optimization** 🚀
>  
> 1. Image management：
> - Modify privacy buttons
> - Storage chart only be access by admin
> 2. Group management：
> - Assign group leader, select by dropdown not include current group leader

## Apr 2021 (v4.6)

#### Welcome to the April 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Report analysis：
> - Add prometheus account password check
> 2. User management：
> - Alert when user does not exist
> 
> ✅ **Bug Fix** 🐛 
> 
> 1. Image management：
> - Fix bug of utilization chart color no change problem
> 2. Report analysis：
> - Fix worker layer GPU unit error
> 3. User management：
> - Fix alert when blank is empty
> 
> ⏩ **Function Optimization** 🚀
>  
> 1. Data management：
> - Enter next page clear filter automatically when searching for file or folder
> 2. Translation：
> - Modify English words

## Mar 2021 (v4.5)

#### Welcome to the March 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. User management：
> - When adding a new user, you can add distributed storage
> 2. Notification system：
> - Read/All read/Delete function
> 3. Schedule management：
> - Add start time check format
> 
> ✅ **Bug Fix** 🐛 
> 
> 1. User management：
> - Fix the problem of unable to add roles
> - Choose not to open the check
> 2. Schedule management：
> - Fix the problem of not being able to select time when creating schedule
> 3. Storage management：
> - Fix the problem of fetching data, modifying parameter names of distributed storage
> - Fix the problem of not being able to modify the available size
> 4. Job submission：
> - Fix the default value of simple settings
> - Fix the establishment of distributed storage
> 5. Report analysis：
> - Single node, corrected GPU chart problem
> 
> ⏩ **Function Optimization** 🚀
>  
> 1. Home：
> - Simplify operations, remove high-performance computing
> 2. Resource management：
> - Adjust the sequence of cluster fields when creating/modifying resources
> 3. All pages：
> - unified CPU, GPU

## Feb 2021 (v4.4)

#### Welcome to the February 2021 edition! There are a number of updates in this version that we hope you will like, some of the main highlights include:

> ✴️ **New Features** ⭐
> 
> 1. User management：
> - Viewed storage permission check prompts
> - Viewed distributed storage prompts
> 2. Node management：
> - One-key shutdown
> - One-key restart
> 3. Notification system：
> - Registration, group management, personal information, node/key/schedule/job management, new schedule, broadcast
> 4. System settings：
> - Open registration
> - Repeated logins
> - Job approval
> 5. Role management：
> - Be able to modify the role name
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. System settings：
> -  Pagination (system parameters, preset images, job submission)
> 2. Job submission：
> - Default settings in different modes
> 3. All pages：
> - A unified 24-hour system
> 4. Forgot password：
> - Reduce user waiting time, adjust title and prompt
> 5. Home：
> - Adjust the small layout display

## Jan 2021 (v4.3)

#### Welcome to the January 2021 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Login：
> - Add product name, product version, company name, copyright year
> 2. Data management：
> - Add rename, move, copy, edit feature
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Home：
> - Cluster status filter is enabled
> 2. Background management：
> - Layout optimization, display by different type
> 3. User management：
> - Layout optimization
> - Add user level limits
> 4. Job submission：
> - Simplify user flow
> - Add default mode
> 5. Schedule management：
> - Optimize operation flow
> - New schedule will start after 5 minutes in default mode
> 6. Personal information：
> - Layout modification
> - Optimize information
> - Be able to edit personal information
> 7. Resource management：
> - Be able to add resource with Chinese name
> - Normal user will not be able to use
> 8. Job management：
> - Simplify layout display
> - Display all content in one page

## Dec 2020 (v4.2)

#### Welcome to the December 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Scheduling system：
> - Add/Edit schedules
> - Resource reservation/Check mirroring
> - Scheduled by steps
> - Job auto start/end
> 2. Job submission：
> - Select/Save template
> 3. Job management：
> - Package container, add upload logo prompt
> - Job monitoring, linked to cluster report
> 4. Cluster management：
> - Add scheduled cluster option
> 5. Resource management：
> - Cluster, add scheduled column
> 6. Data management：
> - Add shielding hidden files mode
> 7. Report analysis：
> - Add user resource usage statistics
> - Check user permissions
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Template management：
> - Set user permissions
> 2. User management：
> - Display user groups

## Nov 2020 (v4.1)

#### Welcome to the November 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Job management：
> - Add the use time of the graphics card
> 2. Web SSH：
> - Support syntax highlighting
> - Automatic refresh
> - Full screen
> 3. Template management：
> - Add/Edit job templates
> 4. System settings：
> - Be able to set the resource options for submitting jobs
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Unit carry：
> - The second phase update, all pages
> 2. Instant code modification：
> - The second phase update, integrating Jupyter Lab and Notebook
> 3. Resource management：
> - Add group management link
> - Adjust the style of progress bar
> 4. Data annotation：
> - The second phase update, the page is embedded and supports mainstream image and video formats
> 5. User management：
> - Apply default values, add/approve users
> 6. Remote desktop：
> - Adjust format and use process

## Oct 2020 (v4.0)

#### Welcome to the October 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Click left-up button auto refresh
> 2. Job submission：
> - Shm memory check
> - Resource limits
> 3. Image management：
> - Update usage tooltip and overload warning
> 4. Web SSH：
> - Support outside network
> 5. System settings：
> - Be able to set available resource
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Unit carry：
> - The first phase update, part of the all pages
> 2. Instant code modification：
> - The first phase update, add Jupyter Lab
> 3. Scheduling system：
> - The first phase update, be able to set using time

## Sep 2020 (v3.9)

#### Welcome to the September 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Login：
> - Forgot password feature
> 2. Help Center：
> - Add online documentation
> 3. Personal info：
> - Be able to view/edit group information
> 4. User management：
> - Add resource limits
> 5. Group management：
> - Be able to split groups and specify reference authorities
> 6. Resource management：
> - Maximize resource usage without limits
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Storage management：
> - NFS/GlusterFS renamed to centralized/distributed storage and simplify usage
> 2. Data annotation：
> - The first phase update, add link
> 3. Report analysis：
> - Optimize layout of view

## Aug 2020 (v3.8)

#### Welcome to the August 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Add fast start up section
> - GlusterFS supported
> 2. Job submission：
> - Add basic/professional mode
> - Be able to preview before submit
> 3. Personal info：
> - Be able to change password
> 4. Job management：
> - Add cpu core and memory views
> 5. Image management
> - Add storage usage information
> 6. Storage management：
> - Add NFS/GlusterFS of separate/share mode
> 7. Report analysis：
> - Cluster/User/Single node/Job of mode for monitoring, output report is available
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Login log：
> - Display ordered by login time
> 2. Lightweight：
> - Speed ​​up page loading speed and reduce mirror image by 90%

## July 2020 (v3.7)

#### Welcome to the July 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Fast document upload
> - DL/ML/HPC docker image for use
> 2. Login：
> - New version background
> 3. Distributed storage：
> - GlusterFS support
> 4. Key management：
> - Add license parameters of GPU number
> 5. Browser check：
> - Suggesting using Chrome
> 6. Login log：
> - Be able to check users login/logout time
> 7. System settings：
> - Add ML/HPC and custom image

## Jun 2020 (v3.6)

#### Welcome to the June 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. System settings：
> - Be able to change default image
> 2. Home：
> - 4.0 Interface with fluent style
> - Display menu based on authority
> 3. Personal info：
> - Be able to check application status
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Style optimization：
> - Login and register page
> 2. Page style：
> - All pages unify styles

## May 2020 (v3.2)

#### Welcome to the April 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. User Login：
> - Avoid login in more than one session
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Modify parameters：
> - paiAzRDMA, IPC_LOCK, IB card mount reference setting
> 2. Page style：
> - Cluster management, hardware utilization, unify styles

## Apr 2020 (v3.1)

#### Welcome to the April 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Modify privileges：
> - User(resource)apply/audit (real-name)
> 2. Limit using：
> -  Time/Resource(cluster+user)
> 3. User management：
> - Define different type of user separately, such as: super manager, group manager, normal user
> 4. Key management：
> - Use License to limit the usage of GPU
> 5. Job submission：
> - Auto install ssh and curl

## Mar 2020 (v3.0)

#### Welcome to the March 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Add dashboard of utilization of hardware
> - Modify resource pool tooltip
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Login：
> - Combine account and password input fields
> 2. Job management：
> - Modify limit job time field, filter tooltip, add alerting of using time out
> 3. User management：
> - When adding new users, you don't have to type job life hour
> - Modify job life hour tooltip
> - Modify batch input users feature
> 4. System operation：
> - Remove bottom layer page
> - Modify hardware utilization node layout

## Feb 2020 (v2.3)

#### Welcome to the February 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - When system resource is not enough for using, it will alert by marquee
> 2. Job submission：
> - Be able to set up shm size
> - Add error messages
> 3. System settings：
> - Modify job life hour
> - Version log
> 4. Job management：
> - Log monitoring
> - Instant code modification
> - Remote desktop
> 5. User management：
> - Limit job life hour
> - Record using time
> - Add comment
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Image management：
> - The second phase update, member setting(add/delete/modify)
> - Item tooltip
> - Image delete

## Jan 2020 (v2.2)

#### Welcome to the January 2020 edition! There are a number of updates in this version that we hope you will like, some of the key highlights include:

> ✴️ **New Features** ⭐
> 
> 1. Home：
> - Job status tooltip
> - Total resource status
> - One-key submit job
> 2. Job management：
> - Package image
> 
> ⏩ **Function Optimization** 🚀
> 
> 1. Job submission：
> - Simplify layout
> - Default image
> - Cluster status tooltip
> 2. Cluster management：
> - Simplify and modify layout
> 3. User management：
> - Extra-ordinary modification, add user interface, simplify and tooltip
> 4. Image management：
> - The first phase update, no need to login, simplify layout, set up image privileges, check repository status
