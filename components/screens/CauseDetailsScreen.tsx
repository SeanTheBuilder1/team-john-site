import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Edit,
  Send,
  Reply,
  CaseUpper,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";
import { getValueByDataKey } from "recharts/types/util/ChartUtils";
import api_link from "@/components/api_link";

interface CauseDetailsScreenProps {
  cause_id: any;
  user: any;
  onBack: () => void;
  onEdit: (cause: any) => void;
  onDelete: (cause: any) => void;
  handleJoinCause: any;
  handleLeaveCause: any;
  triggerUpdate: boolean;
}

export default function CauseDetailsScreen({
  cause_id,
  user,
  onBack,
  onEdit,
  onDelete,
  handleJoinCause,
  handleLeaveCause,
  triggerUpdate,
}: CauseDetailsScreenProps) {
  const [newComment, setNewComment] = useState("");
  const [newUpdate, setNewUpdate] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState([]);
  const [updates, setUpdates] = useState([]);
  // const [cause.user_is_joined, setIsJoined] = useState(false);
  const [cause, setCause] = useState<any>();
  const [volunteers, setVolunteers] = useState<any>();
  const { refresh } = useAuth();

  const getComments = async () => {
    const comment_response = await fetch(api_link + "/api/get-cause-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cause_id: cause_id,
      }),
      credentials: "include",
    });
    if (comment_response.status != 200) {
      return;
    }
    const { message: comment_message, comments } =
      await comment_response.json();
    setComments(
      comments.sort((a: any, b: any) => {
        return a.created_at < b.created_at;
      }),
    );
  };
  const getUpdates = async () => {
    const updates_response = await fetch(api_link + "/api/get-cause-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cause_id: cause_id,
      }),
      credentials: "include",
    });
    if (updates_response.status != 200) {
      return;
    }
    const { message: updates_message, updates } = await updates_response.json();
    setUpdates(
      updates.sort((a: any, b: any) => {
        return a.created_at < b.created_at;
      }),
    );
  };
  const getVolunteers = async () => {
    const volunteers_response = await fetch(
      api_link + "/api/get-cause-volunteers",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cause_id: cause_id,
        }),
        credentials: "include",
      },
    );
    if (volunteers_response.status != 200) {
      return;
    }
    const { message: volunteers_message, volunteers } =
      await volunteers_response.json();
    setVolunteers(
      volunteers.sort((a: any, b: any) => {
        return a.username < b.username;
      }),
    );
  };

  useEffect(() => {
    if (!cause_id) {
      setCause(null);
    }
    (async () => {
      const response = await fetch(api_link + "/api/get-cause-detailed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cause_id: cause_id,
        }),
        credentials: "include",
      });
      if (response.status == 401) {
        await refresh();
        const response = await fetch(api_link + "/api/get-cause-detailed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cause_id: cause_id,
          }),
          credentials: "include",
        });
        if (response.status != 200) {
          const { message: error_msg } = await response.json();
          toast.error(error_msg);
          return;
        }
        const { message: new_message, cause: new_cause } =
          await response.json();
        setCause(new_cause);
        getComments();
        getVolunteers();
        getUpdates();
        return;
      } else if (response.status != 200) {
        const { message: error_msg } = await response.json();
        toast.error(error_msg);
        return;
      }
      const { message, cause } = await response.json();
      setCause(cause);
      getComments();
      getVolunteers();
      getUpdates();
    })();
  }, [cause_id, triggerUpdate]);
  if (!cause) {
    return;
  }

  const isOrganizer = cause.username === user.username;

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startFormatted = start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const endFormatted = end.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (startDate === endDate) {
      return startFormatted;
    }

    return `${startFormatted} to ${endFormatted}`;
  };

  const getLocationDisplay = () => {
    if (cause.campus && cause.location) {
      return `${cause.campus} - ${cause.location}`;
    } else if (cause.campus) {
      return `PUP ${cause.campus}`;
    } else if (cause.location) {
      return cause.location;
    }
    return "Location TBD";
  };

  const handleAddComment = () => {
    (async () => {
      const response = await fetch(api_link + "/api/submit-cause-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cause_id: cause_id,
          comment: newComment,
        }),
        credentials: "include",
      });
      if (response.status == 401) {
        await refresh();
        const response = await fetch(api_link + "/api/submit-cause-comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cause_id: cause_id,
            comment: newComment,
          }),
          credentials: "include",
        });
        if (response.status != 200) {
          return;
        }
        const { message: new_message } = await response.json();
        getComments();
        setNewComment("");
        return;
      } else if (response.status != 200) {
        return;
      }
      const { message } = await response.json();
      getComments();
      setNewComment("");
    })();

    // if (newComment.trim()) {
    //   const comment = {
    //     id: comments.length + 1,
    //     author: user.name,
    //     date: new Date().toLocaleDateString(),
    //     comment: newComment,
    //     replies: [],
    //   };
    //   setComments([...comments, comment]);
    //   setNewComment("");
    // }
  };
  const handleAddUpdate = () => {
    (async () => {
      const response = await fetch(api_link + "/api/submit-cause-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cause_id: cause_id,
          update_text: newUpdate,
        }),
        credentials: "include",
      });
      if (response.status == 401) {
        await refresh();
        const response = await fetch(api_link + "/api/submit-cause-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cause_id: cause_id,
            update_text: newUpdate,
          }),
          credentials: "include",
        });
        if (response.status != 200) {
          return;
        }
        const { message: new_message } = await response.json();
        getUpdates();
        setNewUpdate("");
        return;
      } else if (response.status != 200) {
        return;
      }
      const { message } = await response.json();
      getUpdates();
      setNewUpdate("");
    })();
  };

  const handleAddReply = (commentId: number) => {
    handleAddComment();
    // if (replyText.trim()) {
    //   const updatedComments = comments.map((comment: any) => {
    //     if (comment.comment_id === commentId) {
    //       return {
    //         ...comment,
    //         replies: [
    //           ...(comment.replies || []),
    //           {
    //             id: Date.now(),
    //             author: user.name,
    //             date: new Date().toLocaleDateString(),
    //             comment: replyText,
    //           },
    //         ],
    //       };
    //     }
    //     return comment;
    //   });
    //   setComments(updatedComments);
    //   setReplyText("");
    //   setReplyTo(null);
    // }
  };
  let organizer_type_str: string = cause.organizer_type;
  if (organizer_type_str.length > 0) {
    organizer_type_str =
      String(organizer_type_str).charAt(0).toUpperCase() +
      String(organizer_type_str).slice(1);
  }

  const VolunteersModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white rounded-full lg:rounded-2xl bg-transparent"
        >
          <Users className="w-4 h-4 mr-2" />
          View All Volunteers ({cause.volunteer_count || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#820504] text-xl">
            Volunteers ({cause.volunteer_count || 0})
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-96 lg:max-h-[500px] overflow-y-auto">
          {volunteers && cause.volunteer_count > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {volunteers.map((volunteer: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center p-3 lg:p-4 rounded-xl hover:bg-gray-50"
                >
                  <Avatar className="w-12 h-12 lg:w-14 lg:h-14 mr-4">
                    <AvatarFallback className="bg-[#dca92c] text-white">
                      {volunteer.username
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-[#820504] lg:text-lg">
                      {volunteer.username}
                    </div>
                    <div className="text-sm lg:text-base text-gray-600">
                      {volunteer.course}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12 lg:text-lg">
              No volunteers yet. Be the first to join!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-3 text-[#820504] hover:bg-[#820504]/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-[#820504]">
              Cause Details
            </h1>
          </div>
          {isOrganizer && (
            <div className="inline-flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cause)}
                className="w-24 space-x-2 border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white lg:px-6 lg:py-2"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(cause)}
                className="w-24 space-x-2 border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white lg:px-6 lg:py-2"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:block p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="xl:col-span-2 space-y-8">
              {/* Main Cause Info */}
              <Card className="border-0 shadow-md rounded-3xl">
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-3xl font-bold text-[#820504] leading-tight">
                      {cause.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-[#fede0d]/20 text-[#820504] border-0 px-4 py-2 text-base"
                    >
                      {cause.category}
                    </Badge>
                  </div>
                  <div className="text-lg font-medium text-gray-700 mb-4">
                    Organized by{" "}
                    <span className="text-[#820504]">
                      {cause.username == "sean1"
                        ? cause.username + "☆"
                        : cause.username}
                    </span>
                    <span className="text-sm bg-[#dca92c]/20 text-[#820504] px-2 py-1 rounded-full ml-3 capitalize">
                      {organizer_type_str}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {
                      //     cause.tags.map((tag: string, index: number) => (
                      //   <Badge
                      //     key={index}
                      //     variant="outline"
                      //     className="border-[#dca92c] text-[#dca92c] px-3 py-1"
                      //   >
                      //     {tag}
                      //   </Badge>
                      // ))
                    }

                    <p className="text-gray-700 mb-6 leading-relaxed text-lg text-justify">
                      {cause.short_description}
                    </p>
                    {cause.s3keys?.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {cause.s3keys.map((src: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative group aspect-square overflow-hidden rounded-lg border border-gray-200"
                          >
                            <img
                              src={src}
                              alt={`Preview ${idx}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg text-justify">
                    {cause.detailed_description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-[#820504] flex-shrink-0" />
                      <span className="text-sm">
                        {formatDateRange(cause.start_date, cause.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-[#820504] flex-shrink-0" />
                      <span className="text-sm">{getLocationDisplay()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-[#820504] flex-shrink-0" />
                      <span className="text-sm">
                        {cause.volunteer_count}/{cause.max_volunteers}{" "}
                        volunteers
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-[#820504] flex-shrink-0" />
                      <span className="text-sm">
                        Days available: {cause.preferred_days}
                      </span>
                    </div>
                  </div>

                  <Progress
                    value={(cause.volunteer_count / cause.max_volunteers) * 100}
                    className="mb-8 h-3"
                  />

                  <div className="flex gap-4">
                    {/*<Button
                      onClick={() => handleJoinCause(cause.cause_id)}
                      className={`px-8 py-3 rounded-2xl font-semibold text-base ${
                        cause.user_is_joined
                          ? "bg-gray-500 hover:bg-gray-600 text-white"
                          : "bg-[#820504] hover:bg-[#6d0403] text-white"
                      }`}
                    >
                      {cause.user_is_joined ? "Cause Joined" : "Join Cause"}
                    </Button>
                      */}

                    <Button
                      onClick={
                        cause.user_is_joined
                          ? () => handleLeaveCause(cause.cause_id)
                          : () => handleJoinCause(cause.cause_id)
                      }
                      className={`flex-1 rounded-full font-medium ${
                        cause.user_is_joined
                          ? "bg-gray-500 hover:bg-red-600 text-white"
                          : "bg-[#820504] hover:bg-[#6d0403] text-white"
                      }`}
                      title={
                        cause.user_is_joined ? "Leave cause" : "Join cause"
                      }
                    >
                      {cause.user_is_joined ? "Cause Joined" : "Join Cause"}
                    </Button>
                    <Button className="flex-1 rounded-full font-medium bg-[#820504] hover:bg-[#6d0403] text-white">
                      {user.username == "sean1" ? "Bump" : "Bump (Premium)"}
                    </Button>
                    <VolunteersModal />
                  </div>
                </CardContent>
              </Card>

              {/* Progress Updates */}
              <Card className="border-0 shadow-md rounded-3xl">
                <CardHeader className="p-8">
                  <CardTitle className="text-[#820504] text-2xl">
                    Progress Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {isOrganizer ? (
                    <div className="mb-6">
                      <Textarea
                        placeholder="Add an update post..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        className="mb-3 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl"
                        rows={3}
                      />
                      <Button
                        onClick={handleAddUpdate}
                        disabled={!newUpdate.trim()}
                        className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-2xl px-6"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post Update
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {updates && updates.length > 0 ? (
                    <div className="space-y-6">
                      {updates.map((update: any) => (
                        <div
                          key={update.cause_update_id}
                          className="border-l-4 border-[#820504] pl-6"
                        >
                          <div className="text-gray-500 mb-2">
                            {new Date(update.created_at).toLocaleString(
                              "en-US",
                            )}
                          </div>
                          <p className="text-gray-700 text-lg leading-relaxed">
                            {update.update_text}
                          </p>
                          <div className="text-sm text-gray-500 mt-2">
                            by {update.username}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-12 text-lg">
                      No updates yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-8">
              {/* Map */}
              <Card className="border-0 shadow-md rounded-3xl">
                <CardHeader className="p-6">
                  <CardTitle className="text-[#820504] flex items-center text-xl">
                    <MapPin className="w-6 h-6 mr-3" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Map will be displayed here</p>
                      <p className="text-base mt-2">{getLocationDisplay()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card className="border-0 shadow-md rounded-3xl">
                <CardHeader className="p-6">
                  <CardTitle className="text-[#820504] flex items-center text-xl">
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Comments ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {/* Add Comment */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-3 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl"
                      rows={3}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-2xl px-6"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>

                  {/* Comments List */}
                  <div className="max-h-96 overflow-y-auto">
                    {comments.length > 0 ? (
                      <div className="space-y-6">
                        {comments.map((comment: any) => (
                          <div
                            key={comment.comment_id}
                            className="border-b border-gray-100 pb-6 last:border-b-0"
                          >
                            <div className="flex items-start">
                              <Avatar className="w-10 h-10 mr-3">
                                <AvatarFallback className="bg-[#dca92c] text-white">
                                  {comment.username
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="font-semibold text-[#820504] mr-3">
                                    {comment.username}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      comment.created_at,
                                    ).toLocaleString("en-US")}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                  {comment.comment}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyTo(comment.comment_id)}
                                  className="text-[#820504] hover:bg-[#820504]/10 p-2 h-auto"
                                >
                                  <Reply className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>

                                {/* Reply Form */}
                                {replyTo === comment.comment_id && (
                                  <div className="mt-4 ml-4">
                                    <Textarea
                                      placeholder="Write a reply..."
                                      value={replyText}
                                      onChange={(e) =>
                                        setReplyText(e.target.value)
                                      }
                                      className="mb-3 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                                      rows={2}
                                    />
                                    <div className="flex gap-3">
                                      <Button
                                        onClick={() =>
                                          handleAddReply(comment.comment_id)
                                        }
                                        disabled={!replyText.trim()}
                                        size="sm"
                                        className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-xl"
                                      >
                                        Reply
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          setReplyTo(null);
                                          setReplyText("");
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Replies */}
                                {comment.replies &&
                                  comment.replies.length > 0 && (
                                    <div className="mt-4 ml-4 space-y-4">
                                      {comment.replies.map((reply: any) => (
                                        <div
                                          key={reply.id}
                                          className="flex items-start"
                                        >
                                          <Avatar className="w-8 h-8 mr-3">
                                            <AvatarFallback className="bg-[#820504] text-white text-sm">
                                              {reply.author
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                              <span className="font-medium text-[#820504] mr-2">
                                                {reply.author}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {reply.date}
                                              </span>
                                            </div>
                                            <p className="text-gray-700">
                                              {reply.comment}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No comments yet. Start the conversation!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden p-6 space-y-6">
          {/* Main Cause Info */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl font-bold text-[#820504] leading-tight">
                  {cause.title}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-[#fede0d]/20 text-[#820504] border-0"
                >
                  {cause.category}
                </Badge>
              </div>
              <div className="text-base font-medium text-gray-700 mb-3">
                Organized by{" "}
                <span className="text-[#820504]">
                  {cause.username == "sean1"
                    ? cause.username + "☆"
                    : cause.username}
                </span>
                <span className="text-xs bg-[#dca92c]/20 text-[#820504] px-2 py-1 rounded-full ml-2 capitalize">
                  {organizer_type_str}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {
                  //cause.tags.map((tag: string, index: number) => (
                  //   <Badge key={index} variant="outline" className="text-xs border-[#dca92c] text-[#dca92c]">
                  //     {tag}
                  //   </Badge>
                  //))
                }

                <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                  {cause.short_description}
                </p>
                {cause.s3keys?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {cause.s3keys.map((src: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative group aspect-square overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img
                          src={src}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                {cause.detailed_description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                  <span className="text-xs">
                    {formatDateRange(cause.start_date, cause.end_date)}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                  <span className="truncate">{getLocationDisplay()}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                  <span>
                    {cause.volunteer_count}/{cause.max_volunteers} volunteers
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                  <span>Days available: {cause.preferred_days}</span>
                </div>
              </div>

              <Progress
                value={(cause.volunteer_count / cause.max_volunteers) * 100}
                className="mb-4 h-3"
              />

              <div className="flex gap-3 mb-4">
                <Button
                  onClick={() => handleJoinCause(cause.cause_id)}
                  className={`flex-1 rounded-full font-medium ${
                    cause.user_is_joined
                      ? "bg-gray-500 hover:bg-gray-600 text-white"
                      : "bg-[#820504] hover:bg-[#6d0403] text-white"
                  }`}
                >
                  {cause.user_is_joined ? "Cause Joined" : "Join Cause"}
                </Button>
                <Button className="flex-1 rounded-full font-medium bg-[#820504] hover:bg-[#6d0403] text-white">
                  {user.username == "sean1" ? "Bump" : "Bump (Premium)"}
                </Button>
                <VolunteersModal />
              </div>
            </CardContent>
          </Card>

          {/* Progress Updates */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#820504]">Progress Updates</CardTitle>
            </CardHeader>
            <CardContent>
              {isOrganizer ? (
                <div className="mb-4">
                  <Textarea
                    placeholder="Add an update post..."
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    className="mb-2 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddUpdate}
                    disabled={!newUpdate.trim()}
                    className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Update
                  </Button>
                </div>
              ) : (
                <></>
              )}
              {updates && updates.length > 0 ? (
                <div className="space-y-4">
                  {updates.map((update: any) => (
                    <div
                      key={update.cause_update_id}
                      className="border-l-4 border-[#820504] pl-4"
                    >
                      <div className="text-sm text-gray-500 mb-1">
                        {new Date(update.created_at).toLocaleString("en-US")}
                      </div>
                      <p className="text-gray-700">{update.update_text}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        by {update.username}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No updates yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#820504] flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Map will be displayed here</p>
                  <p className="text-sm">{getLocationDisplay()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#820504] flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment */}
              <div className="mb-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div
                      key={comment.comment_id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarFallback className="bg-[#dca92c] text-white text-sm">
                            {comment.username
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-[#820504] mr-2">
                              {comment.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString(
                                "en-US",
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">
                            {comment.comment}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(comment.comment_id)}
                            className="text-[#820504] hover:bg-[#820504]/10 p-1 h-auto"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>

                          {/* Reply Form */}
                          {replyTo === comment.comment_id && (
                            <div className="mt-3 ml-4">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="mb-2 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    handleAddReply(comment.comment_id)
                                  }
                                  disabled={!replyText.trim()}
                                  size="sm"
                                  className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-full"
                                >
                                  Reply
                                </Button>
                                <Button
                                  onClick={() => {
                                    setReplyTo(null);
                                    setReplyText("");
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 ml-4 space-y-3">
                              {comment.replies.map((reply: any) => (
                                <div
                                  key={reply.id}
                                  className="flex items-start"
                                >
                                  <Avatar className="w-6 h-6 mr-2">
                                    <AvatarFallback className="bg-[#820504] text-white text-xs">
                                      {reply.author
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <span className="font-medium text-[#820504] mr-2 text-sm">
                                        {reply.author}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {reply.date}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                      {reply.comment}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Start the conversation!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
