package Top

import java.io._
import jakarta.servlet._
import jakarta.servlet.http._
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import beans.HistoryBean
import beans.HistoryBean.CheckResult

class AreaCheckServlet extends HttpServlet {

  override def doPost(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    processRequest(req, res)
  }

  override def doGet(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    processRequest(req, res)
  }

  private def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    res.setContentType("text/html")
    res.setCharacterEncoding("UTF-8")
    try {
      val session = req.getSession(true)
      val historyBean = session.getAttribute("historyBean") match {
        case bean: HistoryBean => bean
        case _ =>
          val newBean = new HistoryBean()
          session.setAttribute("historyBean", newBean)
          newBean
      }

      // получаем параметр
      val xParam = req.getParameter("X")
      val yParam = req.getParameter("Y")
      val rParam = req.getParameter("R")

      if (xParam == null || yParam == null || rParam == null) {
        throw new IllegalArgumentException("Все параметры (X, Y, R) обязательны для заполнения")
      }

      val x = xParam.trim.toDouble
      val y = yParam.trim.replace(',', '.').toDouble
      val r = rParam.trim.toDouble

      validateParameters(x, y, r)

      val startTime = System.nanoTime()

      val hit = checkArea(x, y, r)

      val endTime = System.nanoTime()
      val workTime = endTime - startTime

      val now = LocalDateTime.now()
      val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
      val onTime = now.format(formatter)

      // Сохраняем результат в орешек
      historyBean.addResult(x, y, r, hit, onTime, workTime)

      //атрибуты для result.jsp
      req.setAttribute("x", f"$x%.2f")
      req.setAttribute("y", f"$y%.2f")
      req.setAttribute("r", f"$r%.2f")
      req.setAttribute("hit", Boolean.box(hit))
      req.setAttribute("workTime", workTime.toString)
      req.setAttribute("onTime", onTime)

      req.getRequestDispatcher("/jsp/result.jsp").forward(req, res)

    } catch {

      case e: NumberFormatException =>
        req.setAttribute("error", s"Неверный формат числа: ${e.getMessage}")
        req.getRequestDispatcher("/error.jsp").forward(req, res)
      case e: IllegalArgumentException =>
        req.setAttribute("error", e.getMessage)
        req.getRequestDispatcher("/error.jsp").forward(req, res)
      case e: Exception =>
        req.setAttribute("error", s"Произошла ошибка: ${e.getMessage}")
        req.getRequestDispatcher("/error.jsp").forward(req, res)
    }
  }

  private def validateParameters(x: Double, y: Double, r: Double): Unit = {
    if (r < 1 || r > 3) {
      throw new IllegalArgumentException("R должен быть в диапазоне [1, 3]")
    }

    if (x < -4 || x > 4) {
      throw new IllegalArgumentException("X должен быть в диапазоне [-4, 4]")
    }

    if (y < -5 || y > 5) {
      throw new IllegalArgumentException("Y должен быть в диапазоне [-5, 5]")
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