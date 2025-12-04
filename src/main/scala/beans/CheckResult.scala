package beans

import scala.beans.BeanProperty

case class CheckResult(
                        @BeanProperty x: Double,
                        @BeanProperty y: Double,
                        @BeanProperty r: Double,
                        @BeanProperty hit: Boolean,
                        @BeanProperty onTime: String,
                        @BeanProperty workTime: Long
                      ) extends Serializable {

  @BeanProperty
  def getHitResult: String = if (hit) "Попадание" else "Промах"

  override def toString: String =
    s"CheckResult(x=$x, y=$y, r=$r, hit=$hit, onTime=$onTime, workTime=$workTime)"
}