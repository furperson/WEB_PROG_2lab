package beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class HistoryBean implements Serializable {
    private List<CheckResult> results = new ArrayList<>();

    public static class CheckResult implements Serializable {
        private final double x;
        private final double y;
        private final double r;
        private final boolean hit;
        private final String onTime;
        private final long workTime;

        public CheckResult(double x, double y, double r, boolean hit, String onTime, long workTime) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.hit = hit;
            this.onTime = onTime;
            this.workTime = workTime;
        }

        public double getX() { return x; }
        public double getY() { return y; }
        public double getR() { return r; }
        public boolean isHit() { return hit; }
        public String getOnTime() { return onTime; }
        public long getWorkTime() { return workTime; }
    }

    public synchronized void addResult(double x, double y, double r, boolean hit, String onTime, long workTime) {
        results.add(new CheckResult(x, y, r, hit, onTime, workTime));
        // Ограничиваем размер истории для производительности
        if (results.size() > 100) {
            results.remove(0);
        }
    }

    public synchronized void clearHistory() {
        results.clear();
    }

    public synchronized List<CheckResult> getResults() {
        // Возвращаем неизменяемую копию списка для безопасности
        return Collections.unmodifiableList(new ArrayList<>(results));
    }

    public synchronized int getResultCount() {
        return results.size();
    }

    @Override
    public String toString() {
        return "HistoryBean{resultsCount=" + results.size() + "}";
    }
}