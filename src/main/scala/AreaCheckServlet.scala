package com.web3.servlets

import java.io._
import jakarta.servlet._
import jakarta.servlet.http._

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import beans.HistoryBean
import beans.CheckResult
import zio.Differ.set

import com.web3.servlets.PointData


class AreaCheckServlet extends HttpServlet {

  def showError(msg: String,req: HttpServletRequest, res: HttpServletResponse): Unit = {
    req.setAttribute("error", s" ошибка : ${msg}")
    req.getRequestDispatcher("/error.jsp").forward(req, res)
  }

  override def doPost(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    processRequest(req, res)
  }

  override def doGet(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    processRequest(req, res)
  }

  private def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    try {
      val session = req.getSession(true)
      val historyBean = session.getAttribute("historyBean") match {
        case bean: HistoryBean => bean
        case _ =>
          val newBean = new HistoryBean()
          session.setAttribute("historyBean", newBean)
          newBean
      }

      val pointData = getPointData(req) match {
        case Some(pointData) =>
          pointData
        case None =>
          showError("incorrect",req,res)
          PointData(0,0,0,true)
      }

      validateParameters(pointData.x, pointData.y, pointData.r,pointData.isCanvas)

      val startTime = System.nanoTime()

      val hit = checkArea(pointData.x, pointData.y, pointData.r)

      val endTime = System.nanoTime()
      val workTime = endTime - startTime

      val now = LocalDateTime.now()
      val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
      val onTime = now.format(formatter)


      historyBean.addResult(beans.CheckResult(
        pointData.x, pointData.y, pointData.r, hit,
        onTime,
        workTime))

      //атрибуты для result.jsp
      req.setAttribute("x", f"${pointData.x}%.2f")
      req.setAttribute("y", f"${pointData.y}%.2f")
      req.setAttribute("r", f"${pointData.r}%.2f")
      req.setAttribute("hit", Boolean.box(hit))
      req.setAttribute("workTime", workTime.toString)
      req.setAttribute("onTime", onTime)

      req.getRequestDispatcher("/jsp/result.jsp").forward(req, res)

      } catch {
        case e: Exception =>
          showError(e.getMessage,req,res )
      }

  }


  private def getPointData(req: HttpServletRequest): Option[PointData] = {
    val xParam = req.getParameter("X")
    val yParam = req.getParameter("Y")
    val rParam = req.getParameter("R")
    val isCanvasPar = req.getParameter("Canv")

    if (xParam == null || yParam == null || rParam == null ||
      xParam.trim.isEmpty || yParam.trim.isEmpty || rParam.trim.isEmpty) {
      return None
    }

    try {
      val x = xParam.trim.replace(',', '.').toDouble
      val y = yParam.trim.replace(',', '.').toDouble
      val r = rParam.trim.replace(',', '.').toDouble
      val isCanvas = isCanvasPar match {
        case "0" => false
        case "1" => true
        case _ => return None

      }

      if (x.isNaN || y.isNaN || r.isNaN ||
        x.isInfinity || y.isInfinity || r.isInfinity) {
        None
      } else {
        Some(PointData(x, y, r,isCanvas))
      }
    } catch {
      case _: NumberFormatException => None
      case _: NullPointerException => None
      case _: Exception => None
    }
  }

  private def validateParameters(x: Double, y: Double, r: Double, isCanvas: Boolean): Unit = {
    if(isCanvas){
      if (!Set(1,1.5,2,2.5,3)(r)) {
        throw new IllegalArgumentException("R должен быть из (1,1.5,2,2.5,3)")
      }

      if (x < -4 || x > 4) {
        throw new IllegalArgumentException("X должен быть в диапазоне [-4, 4]")
      }

      if (y < -5 || y > 5) {
        throw new IllegalArgumentException("Y должен быть в диапазоне [-5, 5]")
      }
    } else {
      if (!Set(1,1.5,2,2.5,3)(r)) {
        throw new IllegalArgumentException("R должен быть из (1,1.5,2,2.5,3)")
      }

      if (!Set(-4,-3,-2,-1,0,1,2,3,4.0)(x)) {
        throw new IllegalArgumentException("X должен быть из (-4,-3,-2,-1,0,1,2,3,4.0)")
      }

      if (y < -5 || y > 5) {
        throw new IllegalArgumentException("Y должен быть в диапазоне [-5, 5]")
      }
    }
  }

  private def checkArea(x: Double, y: Double, r: Double): Boolean = {
    //  Прямоугольник
    if (x >= -r/2 && x <= 0 && y >= 0 && y <= r) {
      return true
    }

    //  Четверть круга
    if (x >= 0 && y >= 0) {
      val distanceSquared = x * x + y * y
      val radiusHalfSquared = (r / 2) * (r / 2)
      if (distanceSquared <= radiusHalfSquared) {
        return true
      }
    }

    //  Треугольник
    if (x >= 0 && y <= 0 && x <= r/2) {
      if (y >= x-r/2) {
        return true
      }
    }

    false
  }
}