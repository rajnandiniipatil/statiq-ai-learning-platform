import React, { useEffect, useState } from 'react';
import { igotApi } from '../../api/client';
import { IGotCourse } from '../../types';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Award,
  Globe,
  Building,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<IGotCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await igotApi.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching iGOT courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number, title: string) => {
    setEnrollingId(courseId);
    try {
      await igotApi.enroll(courseId);
      setEnrollSuccessMessage(`Successfully enrolled in "${title}"! Check your Learning Roadmap.`);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, enrollmentStatus: 'ENROLLED', progressPercent: 0 } : c))
      );
      setTimeout(() => setEnrollSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error enrolling', err);
    } finally {
      setEnrollingId(null);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">iGOT Karmayogi Course Discovery</h1>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Prototype / Sandbox
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse official training modules mapped from the iGOT Karmayogi capacity building framework for government statistical cadres.
          </p>
        </div>
      </div>

      {/* Mandatory Sandbox Notice Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded flex-shrink-0">
            iGOT Integration — Prototype / Sandbox
          </span>
          <span>
            Connected via <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">MockIGotCourseProvider</code>. Pre-seeded with 22 authentic MoSPI and National Statistical System courses.
          </span>
        </div>
        <span className="text-[11px] font-medium text-amber-700 whitespace-nowrap">
          {courses.length} courses loaded
        </span>
      </div>

      {/* Success Notification */}
      {enrollSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center shadow-sm">
          <CheckCircle className="w-5 h-5 mr-3 text-emerald-600 flex-shrink-0" />
          <span>{enrollSuccessMessage}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search courses by title, code, competency or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="ALL">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue max-w-[200px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No courses match your query</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the difficulty or category filters.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isEnrolled = course.enrollmentStatus === 'ENROLLED' || course.enrollmentStatus === 'IN_PROGRESS';

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                      {course.courseCode}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        course.difficulty === 'ADVANCED'
                          ? 'bg-rose-50 text-rose-700'
                          : course.difficulty === 'INTERMEDIATE'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-blue transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Competency Badges */}
                  {course.competencyNames && course.competencyNames.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {course.competencyNames.map((comp, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 pt-0 space-y-4">
                  {/* Metadata Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {course.durationHours}h
                      </span>
                      <span className="flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-1" />
                        {course.language || 'English'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {course.provider}
                    </span>
                  </div>

                  {/* Enrollment Button */}
                  {isEnrolled ? (
                    <div className="w-full text-center py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Enrolled in Sandbox
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id, course.title)}
                      disabled={enrollingId === course.id}
                      className="w-full py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {enrollingId === course.id ? (
                        'Enrolling...'
                      ) : (
                        <>
                          Enroll via iGOT <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
