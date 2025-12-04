package beans

import scala.beans.BeanProperty
import scala.collection.mutable
import scala.jdk.CollectionConverters._


class HistoryBean extends Serializable {
  private val results = mutable.ListBuffer[CheckResult]()

  def addResult(result: CheckResult): Unit = this.synchronized {
    results.append(result)
  }

  def clearHistory(): Unit = this.synchronized {
    results.clear()
  }


  @BeanProperty
  def getResults: java.util.List[CheckResult] =
    results.toList.asJava

  override def toString: String = s"HistoryBean{resultsCount=${results.size}}"
}