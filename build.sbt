

ThisBuild / scalaVersion := "2.13.17"
ThisBuild / version      := "0.1.0-SNAPSHOT"

javacOptions ++= Seq("--release", "17")
scalacOptions ++= Seq("-release", "17")

enablePlugins(SbtWar)

lazy val root = (project in file("."))
  .settings(

    name := "2lab",
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio" % "2.1.21",

      "jakarta.platform" % "jakarta.jakartaee-api" % "10.0.0" % "provided",
      "jakarta.servlet.jsp.jstl" % "jakarta.servlet.jsp.jstl-api" % "3.0.2" ,
      "org.glassfish.web" % "jakarta.servlet.jsp.jstl" % "3.0.1",
      "jakarta.servlet.jsp" % "jakarta.servlet.jsp-api" % "3.1.1" % "provided",
      "jakarta.el" % "jakarta.el-api" % "5.0.1" % "provided",

      "io.circe" %% "circe-core" % "0.14.15",
      "io.circe" %% "circe-generic" % "0.14.15",
      "io.circe" %% "circe-parser" % "0.14.15"
)
  )