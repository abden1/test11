# دليل إعداد قاعدة بيانات PostgreSQL للتطبيق

هذا الدليل سيساعدك على إعداد قاعدة بيانات PostgreSQL لتطبيق نظام إدارة المستقلين.

## المتطلبات الأساسية

1. تأكد من تثبيت PostgreSQL على جهازك (لديك بالفعل الإصدارات 16 و 17)
2. تأكد من تشغيل خدمة PostgreSQL
3. تثبيت pgAdmin 4 (موجود لديك بالفعل في `C:\Program Files\PostgreSQL\17\pgAdmin 4\runtime\pgAdmin4.exe`)

## الخطوات

### 1. إعادة تعيين كلمة مرور المستخدم postgres

يتعذر على تطبيقك الاتصال بقاعدة البيانات بسبب فشل المصادقة كما هو موضح في الخطأ:
```
FATAL: password authentication failed for user "postgres"
```

لإصلاح ذلك، قم بإعادة تعيين كلمة المرور:

1. افتح موجه الأوامر (CMD) أو PowerShell كمسؤول
2. اذهب إلى مجلد bin الخاص بـ PostgreSQL:
   ```
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```
3. قم بإيقاف خدمة PostgreSQL:
   ```
   net stop postgresql-x64-17
   ```
4. قم بتشغيل PostgreSQL في وضع "trust" حيث لا يطلب كلمة مرور:
   ```
   postgres --auth=trust
   ```
   (اترك هذه النافذة مفتوحة)

5. افتح نافذة PowerShell جديدة كمسؤول وقم بتنفيذ:
   ```
   "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
   ```

6. بعد الدخول إلى psql، قم بتعيين كلمة مرور جديدة:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```

7. أغلق psql بكتابة:
   ```
   \q
   ```

8. عد إلى النافذة الأولى واضغط Ctrl+C لإيقاف عملية PostgreSQL.

9. أعد تشغيل خدمة PostgreSQL:
   ```
   net start postgresql-x64-17
   ```

### 2. إنشاء قاعدة البيانات والجداول

1. قم بتشغيل psql باستخدام كلمة المرور الجديدة:
   ```
   "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
   ```

2. قم بإنشاء قاعدة البيانات:
   ```sql
   CREATE DATABASE freelancer_db;
   ```

3. اتصل بقاعدة البيانات الجديدة:
   ```sql
   \c freelancer_db
   ```

4. قم بإعداد الجداول عن طريق تشغيل ملف SQL المقدم:
   ```sql
   \i C:/SAAS/work/technical\ assessment/database_setup.sql
   ```

### 3. تحديث إعدادات التطبيق

1. قم بتحديث ملف `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/freelancer_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 4. باستخدام pgAdmin 4

يمكنك أيضًا إدارة قاعدة البيانات باستخدام واجهة رسومية:

1. قم بتشغيل pgAdmin 4:
   ```
   "C:\Program Files\PostgreSQL\17\pgAdmin 4\runtime\pgAdmin4.exe"
   ```

2. سجل الدخول باستخدام كلمة المرور الخاصة بـ pgAdmin

3. قم بإضافة خادم جديد:
   - انقر بزر الماوس الأيمن على "Servers" واختر "Create" > "Server"
   - في علامة التبويب "General"، أدخل اسمًا مثل "Local PostgreSQL"
   - في علامة التبويب "Connection":
     - Host: `localhost`
     - Port: `5432`
     - Maintenance database: `postgres`
     - Username: `postgres`
     - Password: `postgres`

4. بعد الاتصال:
   - ستظهر قاعدة البيانات `freelancer_db` تحت Databases
   - يمكنك استعراض الجداول تحت `freelancer_db` > Schemas > public > Tables

## حل المشكلات الشائعة

1. إذا استمرت مشكلة الاتصال، يمكنك التحقق من ملف pg_hba.conf (موجود في `C:\Program Files\PostgreSQL\17\data`) وتأكد من أن المصادقة معدة للسماح بالاتصالات المحلية بنوع `md5`.

2. في حالة عدم القدرة على تشغيل pgAdmin، يمكنك استخدام أداة psql مباشرة.

3. إذا كنت لا تريد إعداد PostgreSQL، يمكنك استخدام H2 كقاعدة بيانات في الذاكرة عن طريق تعديل ملف application.properties:

```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:freelancer_db
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
``` 